import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Tasks() {
  const { name } = useParams();
  const navigate = useNavigate();
  const projectName = name?.trim();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) navigate('/login');
    else fetchTasks();
  }, [fetchTasks, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/project-name/${projectName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks');
    }
  };

  const createTask = async () => {
    setError('');
    if (!newTask.title.trim()) {
      return setError('Title is required');
    }

    try {
      const { data: projects } = await axios.get(
        'http://localhost:5000/api/projects',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const project = projects.find(p => p.name.trim() === projectName);
      if (!project) return setError('Project not found');

      const { data: createdTask } = await axios.post(
        'http://localhost:5000/api/tasks',
        { ...newTask, project: project._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(prev => [...prev, createdTask]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Task creation failed');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const { data: updatedTask } = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(t => (t._id === id ? updatedTask : t)));
    } catch (err) {
      console.error(err);
      setError('Failed to update task status');
    }
  };

  const deleteTask = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header-row">
        <h2>Tasks for Project: {projectName}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id}>
            <span>
              <strong>{task.title}</strong> — {task.status}
            </span>
            <div className="task-actions">
              <Link to={`/projects/${projectName}/tasks/${task._id}`} className="edit-btn">Details</Link>
              <button className="inprogress-btn" onClick={() => updateTaskStatus(task._id, 'in-progress')}>In Progress</button>
              <button className="done-btn" onClick={() => updateTaskStatus(task._id, 'done')}>Done</button>
              <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="create-task-section">
        <h3>Create New Task</h3>
        <div className="task-form">
          <input
            name="title"
            placeholder="Title"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            name="description"
            placeholder="Description"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button className="create-btn" onClick={createTask}>Create Task</button>
        </div>
      </div>
    </div>
  );
}

export default Tasks;

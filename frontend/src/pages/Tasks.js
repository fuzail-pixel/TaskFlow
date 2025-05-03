import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

function Tasks() {
  const { name } = useParams();
  const projectName = name.trim();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/project-name/${projectName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch {
      setError('Failed to fetch tasks');
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) {
      return setError('Title is required');
    }

    try {
      const projectRes = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const projectMatch = projectRes.data.find(p => p.name.trim() === projectName);
      if (!projectMatch) return setError('Project not found');

      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        { ...newTask, project: projectMatch._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Task creation failed');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
    } catch {
      setError('Failed to update task');
    }
  };

  const deleteTask = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch {
      setError('Failed to delete task');
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchTasks();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Tasks for Project: {projectName}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <span>
              <strong>{task.title}</strong> — {task.status}
            </span>
            <span>
              <Link to={`/projects/${projectName}/tasks/${task._id}`} className="edit-btn">Details</Link>
              <button className="inprogress-btn" onClick={() => updateTaskStatus(task._id, 'in-progress')}>In Progress</button>
              <button className="done-btn" onClick={() => updateTaskStatus(task._id, 'done')}>Done</button>
              <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '30px' }}>
        <h3>Create New Task</h3>
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
  );
}

export default Tasks;

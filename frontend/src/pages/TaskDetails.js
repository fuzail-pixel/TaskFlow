import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function TaskDetails() {
  const { taskId, projectName } = useParams();
  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          setTask(res.data);
          setUpdatedTask({ 
            title: res.data.title || '', 
            description: res.data.description || '' 
          });
        } else {
          setError('Task not found');
        }
      } catch (err) {
        setError(`Failed to fetch task: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, token, navigate]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTask(res.data);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError(`Failed to update task: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container">
      <div className="loading-spinner"></div>
      <p>Loading task details...</p>
    </div>
  );

  if (error) return (
    <div className="container">
      <h2>Error</h2>
      <p className="error-message">{error}</p>
      <button onClick={() => navigate(`/projects/${projectName}/tasks`)}>Back to Tasks</button>
    </div>
  );

  if (!task) return (
    <div className="container">
      <h2>Task Not Found</h2>
      <p>The requested task could not be found.</p>
      <button onClick={() => navigate(`/projects/${projectName}/tasks`)}>Back to Tasks</button>
    </div>
  );

  return (
    <div className="container task-details" style={{ maxWidth: '700px', margin: '3rem auto 0', padding: '2rem', background: '#fefefe', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>

      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Task Details</h2>

      {editMode ? (
        <div className="edit-form">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              value={updatedTask.title}
              onChange={e => setUpdatedTask({ ...updatedTask, title: e.target.value })}
              className="form-control"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={updatedTask.description}
              onChange={e => setUpdatedTask({ ...updatedTask, description: e.target.value })}
              className="form-control"
              rows="4"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          <div className="button-group" style={{ display: 'flex', gap: '1rem' }}>
            <button className="create-btn" onClick={handleUpdate}>Save</button>
            <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="task-info" style={{ lineHeight: '1.6' }}>
          <div className="info-item" style={{ marginBottom: '1rem' }}>
            <strong>Title:</strong> <span>{task.title}</span>
          </div>

          <div className="info-item" style={{ marginBottom: '1rem' }}>
            <strong>Description:</strong> 
            <p className="description" style={{ marginTop: '0.5rem' }}>{task.description || "No description provided"}</p>
          </div>

          <div className="info-item" style={{ marginBottom: '1rem' }}>
            <strong>Status:</strong> 
            <span className={`status-badge status-${task.status.toLowerCase()}`}>
              {task.status}
            </span>
          </div>

          <div className="info-item" style={{ marginBottom: '1rem' }}>
            <strong>Created:</strong> 
            <span>{new Date(task.createdAt).toLocaleString()}</span>
          </div>

          {task.completedAt && (
            <div className="info-item" style={{ marginBottom: '1rem' }}>
              <strong>Completed:</strong> 
              <span>{new Date(task.completedAt).toLocaleString()}</span>
            </div>
          )}

          <div className="action-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Task</button>
            <button className="back-btn" onClick={() => navigate(`/projects/${projectName}/tasks`)}>
              Back to Tasks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetails;

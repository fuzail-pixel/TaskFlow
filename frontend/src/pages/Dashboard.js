import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectName, setEditProjectName] = useState('');

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
      setLimitReached(res.data.length >= 4);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects');
    }
  };

  const handleCreate = async () => {
    try {
      setError('');
      const res = await axios.post(
        'http://localhost:5000/api/projects',
        { name: newProjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([...projects, res.data]);
      setNewProjectName('');
      if (projects.length + 1 >= 4) setLimitReached(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project');
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p._id !== id));
      setLimitReached(false);
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const handleEditPrompt = project => {
    setEditProjectId(project._id);
    setEditProjectName(project.name);
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/projects/${editProjectId}`,
        { name: editProjectName },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProjects(
        projects.map(p =>
          p._id === editProjectId ? { ...p, name: res.data.name } : p
        )
      );
      setEditProjectId(null);
      setEditProjectName('');
    } catch (err) {
      setError('Failed to update project');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchProjects();
    }
  }, [token]);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Projects</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {projects.map(p => (
          <li key={p._id}>
            <span>
              <Link to={`/projects/${p.name}/tasks`} style={{ marginRight: '10px', textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                {p.name}
              </Link>
            </span>
            <div className="project-actions">
              <button className="project-edit-btn" onClick={() => handleEditPrompt(p)}>Edit</button>
              <button className="project-delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '30px' }}>
        {!limitReached ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="New project name"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              required
            />
            <button className="create-btn" onClick={handleCreate}>Create Project</button>
          </div>
        ) : (
          <p style={{ color: 'gray' }}>You've reached the max of 4 projects.</p>
        )}
      </div>

      {editProjectId && (
        <div style={{ marginTop: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
          <h4>Edit Project</h4>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input
              type="text"
              value={editProjectName}
              onChange={e => setEditProjectName(e.target.value)}
            />
            <button className="edit-btn" onClick={handleEditSave}>Save</button>
            <button className="cancel-btn" onClick={() => setEditProjectId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
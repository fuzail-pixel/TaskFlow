const Task = require('../models/Task');
const Project = require('../models/Project');

// Create a new task
const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    
    res.json(task);
  } catch (error) {
    console.error(`Error in getTaskById: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get tasks by project name
const getTasksByProjectName = async (req, res) => {
  try {
    const project = await Project.findOne({
      name: req.params.name,
      user: req.user._id
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const tasks = await Task.find({
      project: project._id,
      user: req.user._id
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task by ID
const updateTask = async (req, res) => {
  try {
    const updatedFields = { ...req.body };
    if (req.body.status === 'done') {
      updatedFields.completedAt = new Date();
    } else if (req.body.status) {
      updatedFields.completedAt = undefined;
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Fixed typo: *id → _id
      updatedFields,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not yours' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not yours' });
    }
    res.json({ message: 'Task deleted', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = {
  createTask,
  getTasks,
  getTaskById, // Added new controller to exports
  updateTask,
  deleteTask,
  getTasksByProjectName
};
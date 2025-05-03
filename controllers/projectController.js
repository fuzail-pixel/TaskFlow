const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const existingCount = await Project.countDocuments({ user: req.user._id });

    if (existingCount >= 4) {
      return res.status(400).json({ message: 'Maximum 4 projects allowed per user' });
    }

    const project = await Project.create({
      name: req.body.name,
      user: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add these:

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = req.body.name || project.name;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Updated export:
module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject
};

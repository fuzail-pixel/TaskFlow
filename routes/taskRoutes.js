const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  getTaskById, 
  updateTask,
  deleteTask,
  getTasksByProjectName
} = require('../controllers/taskController');

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.get('/project-name/:name', protect, getTasksByProjectName);
router.get('/:id', protect, getTaskById); 
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
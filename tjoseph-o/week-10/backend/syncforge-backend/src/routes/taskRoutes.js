const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// @route   GET /api/tasks
// @desc    Get all tasks with optional filters
// @access  Public
router.get('/', taskController.getAllTasks);

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Public
router.get('/stats', taskController.getTaskStats);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Public
router.get('/:id', taskController.getTaskById);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Public
router.post('/', taskController.createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Public
router.put('/:id', taskController.updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Public
router.delete('/:id', taskController.deleteTask);

module.exports = router;

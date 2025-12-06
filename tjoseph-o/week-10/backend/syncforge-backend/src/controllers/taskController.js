const taskStore = require('../models/taskStore');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidator');

class TaskController {
  // Get all tasks with optional filters
  async getAllTasks(req, res) {
    try {
      const { status, priority, assignee } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (assignee) filters.assignee = assignee;

      const tasks = taskStore.getAllTasks(filters);

      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tasks',
        error: error.message,
      });
    }
  }

  // Get task by ID
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = taskStore.getTaskById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`,
        });
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve task',
        error: error.message,
      });
    }
  }

  // Create new task
  async createTask(req, res) {
    try {
      const { error, value } = createTaskSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map((detail) => detail.message),
        });
      }

      const task = taskStore.createTask(value);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: error.message,
      });
    }
  }

  // Update task
  async updateTask(req, res) {
    try {
      const { id } = req.params;

      const { error, value } = updateTaskSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map((detail) => detail.message),
        });
      }

      const task = taskStore.updateTask(id, value);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update task',
        error: error.message,
      });
    }
  }

  // Delete task
  async deleteTask(req, res) {
    try {
      const { id } = req.params;

      const deleted = taskStore.deleteTask(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete task',
        error: error.message,
      });
    }
  }

  // Get task statistics
  async getTaskStats(req, res) {
    try {
      const stats = taskStore.getTaskStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve task statistics',
        error: error.message,
      });
    }
  }
}

module.exports = new TaskController();

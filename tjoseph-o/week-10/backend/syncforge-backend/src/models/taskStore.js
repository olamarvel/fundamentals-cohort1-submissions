const { v4: uuidv4 } = require('uuid');

class TaskStore {
  constructor() {
    this.tasks = new Map();
    this.initSampleData();
  }

  initSampleData() {
    const sampleTasks = [
      {
        id: uuidv4(),
        title: 'Setup CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: 'in-progress',
        priority: 'high',
        assignee: 'alice@syncforge.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Implement Code Review Guidelines',
        description: 'Document code review process and PR templates',
        status: 'completed',
        priority: 'medium',
        assignee: 'bob@syncforge.com',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleTasks.forEach((task) => {
      this.tasks.set(task.id, task);
    });
  }

  getAllTasks(filters = {}) {
    let tasks = Array.from(this.tasks.values());

    // Apply filters
    if (filters.status) {
      tasks = tasks.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      tasks = tasks.filter((task) => task.priority === filters.priority);
    }

    if (filters.assignee) {
      tasks = tasks.filter((task) => task.assignee === filters.assignee);
    }

    // Sort by createdAt descending
    return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getTaskById(id) {
    return this.tasks.get(id);
  }

  createTask(taskData) {
    const task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  updateTask(id, updates) {
    const task = this.tasks.get(id);
    if (!task) {
      return null;
    }

    const updatedTask = {
      ...task,
      ...updates,
      id: task.id, // Prevent ID modification
      createdAt: task.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id) {
    return this.tasks.delete(id);
  }

  getTaskStats() {
    const tasks = Array.from(this.tasks.values());
    return {
      total: tasks.length,
      byStatus: {
        'todo': tasks.filter((t) => t.status === 'todo').length,
        'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
        'in-review': tasks.filter((t) => t.status === 'in-review').length,
        'completed': tasks.filter((t) => t.status === 'completed').length,
      },
      byPriority: {
        low: tasks.filter((t) => t.priority === 'low').length,
        medium: tasks.filter((t) => t.priority === 'medium').length,
        high: tasks.filter((t) => t.priority === 'high').length,
      },
    };
  }
}

module.exports = new TaskStore();

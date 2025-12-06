import { useState } from 'react';
import { taskService } from '../services/taskService';

const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'in-review': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

const PRIORITY_COLORS = {
  low: 'border-gray-300',
  medium: 'border-yellow-400',
  high: 'border-red-400',
};

function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updated = await taskService.updateTask(task.id, { status, priority });
      onUpdate(updated.data);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    try {
      await taskService.deleteTask(task.id);
      onDelete(task.id);
    } catch (error) {
      alert('Failed to delete task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${PRIORITY_COLORS[task.priority]}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status]}`}>
          {task.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">
            <span className="font-medium">Priority:</span>{' '}
            <span className={`capitalize ${
              task.priority === 'high' ? 'text-red-600 font-semibold' :
              task.priority === 'medium' ? 'text-yellow-600 font-semibold' :
              'text-gray-600'
            }`}>
              {task.priority}
            </span>
          </span>
          {task.assignee && (
            <span className="text-gray-500">
              <span className="font-medium">Assignee:</span> {task.assignee}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary-600 hover:text-primary-800 font-medium"
            disabled={loading}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 font-medium"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Task'}
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;

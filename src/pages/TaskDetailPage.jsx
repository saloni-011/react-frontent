import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { tasksApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status update within detail page
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccessMessage, setStatusSuccessMessage] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTaskDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getById(id);
      setTask(data);
    } catch (err) {
      console.error('Failed to load task details:', err);
      setError(err.message || 'Task not found or failed to load.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTaskDetail();
  }, [fetchTaskDetail]);

  const handleStatusChange = async (newStatus) => {
    if (!task || task.status === newStatus) return;
    setIsUpdatingStatus(true);
    setStatusSuccessMessage('');
    try {
      const updated = await tasksApi.update(id, { status: newStatus });
      setTask(updated);
      setStatusSuccessMessage(`Status updated to ${newStatus.replace('_', ' ')}.`);
      setTimeout(() => setStatusSuccessMessage(''), 3500);
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    try {
      await tasksApi.delete(id);
      navigate('/tasks', { replace: true });
    } catch (err) {
      alert(`Failed to delete task: ${err.message}`);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-state-card">
          <LoadingSpinner text={`Loading task #${id} details...`} size="lg" />
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="page-container">
        <div className="detail-breadcrumb">
          <Link to="/tasks" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} className="icon-mr" />
            Back to Tasks
          </Link>
        </div>

        <ErrorMessage
          title="Task not found"
          message={error || `Could not find task with ID #${id}.`}
          onRetry={fetchTaskDetail}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Navigation Breadcrumb & Actions Bar */}
      <div className="detail-header-bar">
        <Link to="/tasks" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="icon-mr" />
          Back to Tasks
        </Link>

        <div className="detail-header-actions">
          <Link to={`/tasks/${id}/edit`} className="btn btn-secondary">
            <Edit3 size={16} className="icon-mr" />
            Edit Task
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            <Trash2 size={16} className="icon-mr" />
            Delete
          </button>
        </div>
      </div>

      {statusSuccessMessage && (
        <div className="success-banner" role="status">
          <CheckCircle2 size={16} className="icon-mr" />
          {statusSuccessMessage}
        </div>
      )}

      {/* Main Detail Card */}
      <div className="detail-card">
        <div className="detail-card-header">
          <div className="detail-title-group">
            <div className="detail-meta-pill">
              <span className="task-id-tag">Task #{task.id}</span>
              <StatusBadge status={task.status} size="lg" />
            </div>
            <h1 className="detail-title">{task.title}</h1>
          </div>

          {/* Quick status selector */}
          <div className="detail-status-changer">
            <label htmlFor="status-select" className="status-changer-label">
              Change Status:
            </label>
            <select
              id="status-select"
              value={task.status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="status-changer-select"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="detail-card-body">
          <h2 className="section-heading">Description</h2>
          <div className="description-content">
            {task.description ? (
              <p className="description-text">{task.description}</p>
            ) : (
              <p className="no-description-text">
                No description was provided for this task.
              </p>
            )}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="detail-card-footer">
          <div className="metadata-item">
            <Calendar size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Created At</span>
              <span className="meta-value">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="metadata-item">
            <Clock size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Last Updated</span>
              <span className="meta-value">
                {task.updatedAt
                  ? new Date(task.updatedAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="metadata-item">
            <UserCheck size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Assigned Owner</span>
              <span className="meta-value">User #{task.userId || 'You'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${task.title}"?`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteTask}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  ListTodo,
  CheckCircle2,
  Clock,
  Loader,
  X,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { tasksApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';

export default function TaskListPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Status updating state for quick toggles
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tasksApi.getAll({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: activeSearch
      });
      // The API returns { count, tasks: [...] }
      setTasks(Array.isArray(response.tasks) ? response.tasks : []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err.message || 'Failed to fetch tasks from the API.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, activeSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounced search trigger on submit or clear
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
  };

  // Quick status update directly from the card
  const handleQuickStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      const updated = await tasksApi.update(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: updated.status } : t))
      );
    } catch (err) {
      alert(`Could not update task status: ${err.message}`);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Delete task handlers
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await tasksApi.delete(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate summary metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'PENDING').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    return { total, pending, inProgress, completed };
  }, [tasks]);

  return (
    <div className="page-container">
      {/* Header section with page title & action */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks Dashboard</h1>
          <p className="page-subtitle">
            Manage, organize, and track your active tasks in real-time.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            onClick={fetchTasks}
            disabled={isLoading}
            className="btn btn-secondary"
            title="Refresh tasks from server"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin icon-mr' : 'icon-mr'} />
            Refresh
          </button>
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={18} className="icon-mr" />
            Create Task
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box blue">
            <ListTodo size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Filtered</span>
            <span className="metric-value">{stats.total}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box amber">
            <Clock size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Pending</span>
            <span className="metric-value">{stats.pending}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box indigo">
            <Loader size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">In Progress</span>
            <span className="metric-value">{stats.inProgress}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green">
            <CheckCircle2 size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Completed</span>
            <span className="metric-value">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-card">
        <div className="filters-container">
          {/* Status filter tabs */}
          <div className="status-tabs" role="tablist" aria-label="Task status filter">
            {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((statusKey) => {
              const label =
                statusKey === 'ALL'
                  ? 'All Tasks'
                  : statusKey === 'PENDING'
                  ? 'Pending'
                  : statusKey === 'IN_PROGRESS'
                  ? 'In Progress'
                  : 'Completed';

              return (
                <button
                  key={statusKey}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === statusKey}
                  onClick={() => setStatusFilter(statusKey)}
                  className={`status-tab-btn ${statusFilter === statusKey ? 'active' : ''}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="search-input"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-secondary btn-search">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area: Loading, Error, or Task Cards */}
      {isLoading ? (
        <div className="loading-state-card">
          <LoadingSpinner text="Fetching tasks from REST API..." size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage
          title="Could not load tasks"
          message={error}
          onRetry={fetchTasks}
        />
      ) : tasks.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">
            <FolderOpen size={48} />
          </div>
          <h3 className="empty-state-title">No tasks found</h3>
          <p className="empty-state-desc">
            {activeSearch || statusFilter !== 'ALL'
              ? 'No tasks match your current filter and search criteria.'
              : 'You have not created any tasks yet. Get started by adding your first task!'}
          </p>
          <div className="empty-state-actions">
            {activeSearch || statusFilter !== 'ALL' ? (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ALL');
                  handleClearSearch();
                }}
                className="btn btn-secondary"
              >
                Reset Filters
              </button>
            ) : (
              <Link to="/tasks/new" className="btn btn-primary">
                <Plus size={16} className="icon-mr" />
                Create First Task
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => {
            const isUpdating = updatingTaskId === task.id;
            return (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <StatusBadge status={task.status} size="sm" />
                  <span className="task-id-badge">#{task.id}</span>
                </div>

                <div className="task-card-body">
                  <h3 className="task-card-title">
                    <Link to={`/tasks/${task.id}`} className="task-title-link">
                      {task.title}
                    </Link>
                  </h3>
                  <p className="task-card-desc">
                    {task.description || (
                      <span className="text-muted italic">No description provided</span>
                    )}
                  </p>
                </div>

                {/* Status Quick Changer */}
                <div className="task-quick-status">
                  <span className="quick-status-label">Status:</span>
                  <select
                    value={task.status}
                    disabled={isUpdating}
                    onChange={(e) => handleQuickStatusChange(task.id, e.target.value)}
                    className="quick-status-select"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="task-card-footer">
                  <span className="task-date">
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Recently'}
                  </span>

                  <div className="task-card-actions">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="btn-icon-action"
                      title="View details"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/tasks/${task.id}/edit`}
                      className="btn-icon-action"
                      title="Edit task"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setTaskToDelete(task)}
                      className="btn-icon-action danger"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message={
          taskToDelete
            ? `Are you sure you want to permanently delete "${taskToDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setTaskToDelete(null);
        }}
      />
    </div>
  );
}


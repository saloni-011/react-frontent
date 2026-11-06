import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Clock, Loader, CheckCircle } from 'lucide-react';
import { tasksApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ALLOWED_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function TaskFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // Form inputs state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING'
  });

  // Client-side validation errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission & Loading state
  const [isFetchingInitial, setIsFetchingInitial] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // If in Edit Mode, fetch the existing task data
  const fetchExistingTask = useCallback(async () => {
    setIsFetchingInitial(true);
    setApiError(null);
    try {
      const task = await tasksApi.getById(id);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'PENDING'
      });
    } catch (err) {
      console.error('Failed to load task for editing:', err);
      setApiError(err.message || 'Failed to fetch task details.');
    } finally {
      setIsFetchingInitial(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchExistingTask();
    }
  }, [isEditMode, fetchExistingTask]);

  // Client-Side Validation Function
  const validate = useCallback((values) => {
    const newErrors = {};

    // Validate Title
    if (!values.title || values.title.trim().length === 0) {
      newErrors.title = 'Title is required and cannot be empty.';
    } else if (values.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters.';
    } else if (values.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters.';
    }

    // Validate Description
    if (values.description && values.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2,000 characters.';
    }

    // Validate Status
    if (!values.status || !ALLOWED_STATUSES.includes(values.status)) {
      newErrors.status = 'Please select a valid task status.';
    }

    return newErrors;
  }, []);

  // Handle field change with dynamic error checking
  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    // If this field was already touched, re-validate dynamically
    if (touched[name]) {
      const fieldErrors = validate(nextFormData);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  // Handle blur to mark field as touched
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // Mark all as touched
    setTouched({
      title: true,
      description: true,
      status: true
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await tasksApi.update(id, {
          title: formData.title.trim(),
          description: formData.description.trim() || '',
          status: formData.status
        });
        navigate(`/tasks/${id}`);
      } else {
        const created = await tasksApi.create({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          status: formData.status
        });
        navigate(`/tasks/${created.id || ''}`);
      }
    } catch (err) {
      console.error('Failed to submit form:', err);
      setApiError(err.message || 'An error occurred while saving the task.');
      setIsSubmitting(false);
    }
  };

  if (isFetchingInitial) {
    return (
      <div className="page-container">
        <div className="loading-state-card">
          <LoadingSpinner text={`Fetching task #${id} details...`} size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container form-page-container">
      {/* Breadcrumb Navigation */}
      <div className="form-breadcrumb">
        <Link to={isEditMode ? `/tasks/${id}` : '/tasks'} className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="icon-mr" />
          {isEditMode ? 'Back to Task Details' : 'Back to Tasks Dashboard'}
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h1 className="form-title">
            {isEditMode ? `Edit Task #${id}` : 'Create New Task'}
          </h1>
          <p className="form-subtitle">
            {isEditMode
              ? 'Modify the details and status below to update this task in your REST API database.'
              : 'Fill in the information below to add a new task to your task manager.'}
          </p>
        </div>

        {apiError && (
          <div className="error-alert mb-6" role="alert">
            <AlertCircle size={20} className="error-icon" />
            <div className="error-content">
              <h4 className="error-title">Submission Failed</h4>
              <p className="error-message">{apiError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="form-element">
          {/* Title Field */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="title" className="form-label required">
                Task Title
              </label>
              <span className={`char-counter ${formData.title.length > 200 ? 'text-danger' : ''}`}>
                {formData.title.length} / 200
              </span>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Implement OAuth Authentication flow"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.title && errors.title ? 'input-error' : ''}`}
              aria-invalid={Boolean(touched.title && errors.title)}
              aria-describedby="title-error"
              disabled={isSubmitting}
            />
            {touched.title && errors.title && (
              <p id="title-error" className="field-error-message">
                <AlertCircle size={14} className="icon-mr" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="description" className="form-label">
                Description <span className="label-optional">(Optional)</span>
              </label>
              <span className={`char-counter ${formData.description.length > 2000 ? 'text-danger' : ''}`}>
                {formData.description.length} / 2000
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Provide context, acceptance criteria, or key notes for this task..."
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-textarea ${
                touched.description && errors.description ? 'input-error' : ''
              }`}
              aria-invalid={Boolean(touched.description && errors.description)}
              aria-describedby="description-error"
              disabled={isSubmitting}
            />
            {touched.description && errors.description && (
              <p id="description-error" className="field-error-message">
                <AlertCircle size={14} className="icon-mr" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Status Selection */}
          <div className="form-group">
            <label className="form-label required">Initial Status</label>
            <div className="status-radio-grid">
              <label
                className={`status-radio-option ${
                  formData.status === 'PENDING' ? 'selected pending' : ''
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="PENDING"
                  checked={formData.status === 'PENDING'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Clock size={18} className="status-radio-icon text-amber" />
                <div>
                  <span className="status-radio-title">Pending</span>
                  <p className="status-radio-desc">Task is queued and yet to start.</p>
                </div>
              </label>

              <label
                className={`status-radio-option ${
                  formData.status === 'IN_PROGRESS' ? 'selected in-progress' : ''
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="IN_PROGRESS"
                  checked={formData.status === 'IN_PROGRESS'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Loader size={18} className="status-radio-icon text-indigo" />
                <div>
                  <span className="status-radio-title">In Progress</span>
                  <p className="status-radio-desc">Work is actively underway.</p>
                </div>
              </label>

              <label
                className={`status-radio-option ${
                  formData.status === 'COMPLETED' ? 'selected completed' : ''
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="COMPLETED"
                  checked={formData.status === 'COMPLETED'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <CheckCircle size={18} className="status-radio-icon text-green" />
                <div>
                  <span className="status-radio-title">Completed</span>
                  <p className="status-radio-desc">Task has been fully resolved.</p>
                </div>
              </label>
            </div>
            {touched.status && errors.status && (
              <p className="field-error-message">
                <AlertCircle size={14} className="icon-mr" />
                {errors.status}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions-row">
            <button
              type="button"
              onClick={() => navigate(isEditMode ? `/tasks/${id}` : '/tasks')}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin icon-mr" />
                  Saving Task...
                </>
              ) : (
                <>
                  <Save size={16} className="icon-mr" />
                  {isEditMode ? 'Update Task' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


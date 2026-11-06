import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = (values) => {
    const errs = {};

    // Name validation
    if (!values.name || values.name.trim().length === 0) {
      errs.name = 'Full name is required.';
    } else if (values.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    // Email validation
    if (!values.email || values.email.trim().length === 0) {
      errs.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g., alex@example.com).';
    }

    // Password validation (min 6 characters required by WA-2 backend)
    if (!values.password) {
      errs.password = 'Password is required.';
    } else if (values.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    // Confirm password
    if (!values.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (values.confirmPassword !== values.password) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValues = { ...formData, [name]: value };
    setFormData(nextValues);

    if (touched[name]) {
      const errs = validate(nextValues);
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    const errs = validate(formData);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      await register(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );
      navigate('/tasks', { replace: true });
    } catch (err) {
      console.error('Registration failed:', err);
      setServerError(err.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <UserPlus size={26} className="text-primary" />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Sign up to start organizing tasks with our live REST API backend.
          </p>
        </div>

        {serverError && (
          <div className="error-alert mb-5" role="alert">
            <AlertCircle size={18} className="error-icon" />
            <div className="error-content">
              <h4 className="error-title">Registration Error</h4>
              <p className="error-message">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label required">
              Full Name
            </label>
            <div className="input-with-icon">
              <User size={16} className="field-icon" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Saloni Sharma"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input icon-indent ${
                  touched.name && errors.name ? 'input-error' : ''
                }`}
                disabled={isSubmitting}
              />
            </div>
            {touched.name && errors.name && (
              <p className="field-error-message">
                <AlertCircle size={13} className="icon-mr" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label required">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="saloni@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input icon-indent ${
                  touched.email && errors.email ? 'input-error' : ''
                }`}
                disabled={isSubmitting}
              />
            </div>
            {touched.email && errors.email && (
              <p className="field-error-message">
                <AlertCircle size={13} className="icon-mr" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label required">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input icon-indent ${
                  touched.password && errors.password ? 'input-error' : ''
                }`}
                disabled={isSubmitting}
              />
            </div>
            {touched.password && errors.password && (
              <p className="field-error-message">
                <AlertCircle size={13} className="icon-mr" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label required">
              Confirm Password
            </label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input icon-indent ${
                  touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''
                }`}
                disabled={isSubmitting}
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="field-error-message">
                <AlertCircle size={13} className="icon-mr" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-auth"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin icon-mr" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


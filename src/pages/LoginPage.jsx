import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/tasks';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = (values) => {
    const errs = {};
    if (!values.email || values.email.trim().length === 0) {
      errs.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      errs.email = 'Please enter a valid email address (e.g., user@example.com).';
    }

    if (!values.password) {
      errs.password = 'Password is required.';
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

    setTouched({ email: true, password: true });
    const errs = validate(formData);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      await login(formData.email.trim().toLowerCase(), formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setServerError(err.message || 'Invalid credentials or server unavailable.');
      setIsSubmitting(false);
    }
  };

  // Helper to fill demo account
  const handleFillDemo = () => {
    setFormData({
      email: 'saloni@example.com',
      password: 'password123'
    });
    setErrors({});
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <LogIn size={26} className="text-primary" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to access your REST API tasks and dashboard.
          </p>
        </div>

        {serverError && (
          <div className="error-alert mb-5" role="alert">
            <AlertCircle size={18} className="error-icon" />
            <div className="error-content">
              <h4 className="error-title">Authentication Failed</h4>
              <p className="error-message">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
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
                placeholder="name@example.com"
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
                autoComplete="current-password"
                placeholder="••••••••"
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

          <button
            type="submit"
            className="btn btn-primary w-full btn-auth"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin icon-mr" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Account Helper */}
        <div className="demo-fill-box">
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn-demo-helper"
          >
            <Sparkles size={14} className="icon-mr" />
            Prefill Demo Credentials (saloni@example.com)
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


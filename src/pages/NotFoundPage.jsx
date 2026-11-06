import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-container not-found-container">
      <div className="not-found-card">
        <div className="not-found-icon-circle">
          <HelpCircle size={48} className="text-primary" />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          The page or route you are looking for does not exist or may have been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/tasks" className="btn btn-primary">
            <Home size={16} className="icon-mr" />
            Go to Tasks Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} className="icon-mr" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}


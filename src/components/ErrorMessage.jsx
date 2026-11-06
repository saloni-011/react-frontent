import React from 'react';
import { AlertCircle, RefreshCw, ServerCrash } from 'lucide-react';

export default function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  isNetworkError = false
}) {
  const isNetwork = isNetworkError || (typeof message === 'string' && (
    message.toLowerCase().includes('connect') ||
    message.toLowerCase().includes('server') ||
    message.toLowerCase().includes('offline') ||
    message.toLowerCase().includes('fetch')
  ));

  return (
    <div className="error-alert" role="alert">
      <div className="error-icon-wrapper">
        {isNetwork ? <ServerCrash size={24} /> : <AlertCircle size={24} />}
      </div>
      <div className="error-content">
        <h4 className="error-title">{title}</h4>
        <p className="error-message">
          {message || 'An unexpected error occurred while communicating with the API.'}
        </p>

        {isNetwork && (
          <div className="error-tip">
            <strong>Troubleshooting Tip:</strong> Make sure your backend REST API is running.
            Open your terminal, navigate to <code>rest-api-task</code>, and run{' '}
            <code>npm start</code> or <code>node src/index.js</code> (default port: 5000).
          </div>
        )}

        {onRetry && (
          <div className="error-actions">
            <button type="button" onClick={onRetry} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} className="icon-mr" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


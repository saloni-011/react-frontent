import React, { useState } from 'react';
import { WifiOff, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROOT_URL } from '../services/api';

export default function ServerStatusBanner() {
  const { backendOnline, checkBackend } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (backendOnline !== false || dismissed) {
    return null;
  }

  const handleRetry = async () => {
    setIsChecking(true);
    await checkBackend();
    setIsChecking(false);
  };

  return (
    <div className="server-status-banner" role="status">
      <div className="server-status-content">
        <WifiOff size={18} className="banner-icon" />
        <span className="banner-text">
          <strong>Backend Offline or Spinning Up:</strong> Cannot reach the REST API at{' '}
          <code>{ROOT_URL}</code>. Free cloud tiers (such as Render) spin down during inactivity and take 30–60 seconds to wake up.
        </span>
      </div>

      <div className="banner-actions">
        <button
          type="button"
          onClick={handleRetry}
          disabled={isChecking}
          className="banner-retry-btn"
        >
          <RefreshCw size={14} className={isChecking ? 'animate-spin icon-mr' : 'icon-mr'} />
          {isChecking ? 'Checking...' : 'Retry Connection'}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="banner-close-btn"
          aria-label="Dismiss banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
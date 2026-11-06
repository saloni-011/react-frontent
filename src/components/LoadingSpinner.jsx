import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading data...', size = 'md' }) {
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;

  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <Loader2 className="spinner-icon animate-spin" size={iconSize} />
      {text && <span className="spinner-text">{text}</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}


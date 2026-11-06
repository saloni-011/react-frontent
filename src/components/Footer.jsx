import React from 'react';
import { Layers, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <Layers size={16} className="footer-icon" />
            <span>TaskFlow Frontend</span>
          </div>
          <span className="footer-dot">•</span>
          <span className="footer-meta">Valentius Kryptix Internship WA-3</span>
        </div>

        <div className="footer-right">
          <div className="footer-badge">
            <CheckCircle size={13} className="badge-check-icon" />
            <span>Vite + React Router + Context API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


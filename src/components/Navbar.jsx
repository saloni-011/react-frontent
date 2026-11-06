import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, backendOnline } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon-wrapper">
            <CheckSquare size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">TaskFlow</span>
            <span className="brand-subtitle">REST API Client</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/tasks"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
              >
                <LayoutDashboard size={17} className="icon-mr" />
                Dashboard
              </NavLink>

              <NavLink
                to="/tasks/new"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
              >
                <PlusCircle size={17} className="icon-mr" />
                New Task
              </NavLink>
            </>
          ) : null}
        </nav>

        {/* Right Section: Backend Status Pill & User Controls */}
        <div className="navbar-actions-desktop">
          {/* API Health Pill */}
          <div
            className={`api-status-pill ${
              backendOnline ? 'status-online' : 'status-offline'
            }`}
            title={
              backendOnline
                ? 'Backend REST API is responding'
                : 'Backend REST API is unreachable at port 5000'
            }
          >
            {backendOnline ? (
              <>
                <Wifi size={13} className="status-dot-icon" />
                <span className="status-dot"></span>
                <span>API Online</span>
              </>
            ) : (
              <>
                <WifiOff size={13} className="status-dot-icon" />
                <span className="status-dot offline"></span>
                <span>API Offline</span>
              </>
            )}
          </div>

          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-info-chip">
                <div className="user-avatar">
                  <User size={15} />
                </div>
                <div className="user-meta">
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-sm btn-logout"
                title="Sign out of account"
              >
                <LogOut size={16} className="icon-mr" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-content">
            {isAuthenticated ? (
              <>
                <div className="mobile-user-card">
                  <div className="user-avatar lg">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="mobile-user-name">{user?.name}</p>
                    <p className="mobile-user-email">{user?.email}</p>
                  </div>
                </div>

                <div className="mobile-links">
                  <NavLink
                    to="/tasks"
                    end
                    className={({ isActive }) =>
                      `mobile-link ${isActive ? 'active' : ''}`
                    }
                    onClick={closeMobileMenu}
                  >
                    <LayoutDashboard size={18} className="icon-mr" />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/tasks/new"
                    className={({ isActive }) =>
                      `mobile-link ${isActive ? 'active' : ''}`
                    }
                    onClick={closeMobileMenu}
                  >
                    <PlusCircle size={18} className="icon-mr" />
                    Create Task
                  </NavLink>
                </div>

                <div className="mobile-drawer-footer">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-danger w-full"
                  >
                    <LogOut size={16} className="icon-mr" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mobile-auth-links">
                <Link
                  to="/login"
                  className="btn btn-secondary w-full"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary w-full"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


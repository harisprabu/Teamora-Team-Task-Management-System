import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faChevronDown, faBell, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { RoleBadge } from "./Badge";
import { notificationService } from "../services/notificationService";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAdmin, isTeamLeader } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : isTeamLeader
    ? "/team-leader/dashboard"
    : "/member/dashboard";

  useEffect(() => {
    if (user) {
      notificationService
        .getUnreadCount()
        .then((data) => setUnreadCount(data.unreadCount || 0))
        .catch(() => {});
    }
  }, [user]);

  // Close the popup when clicking outside or pressing Escape
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Navigation">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <Link to={dashboardPath} className="navbar-brand">
          <span className="brand-icon">
            <FontAwesomeIcon icon={faUsers} style={{ color: "rgb(250, 251, 252)" }} />
          </span>
          <span className="brand-text">Teamora</span>
        </Link>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="profile-menu" ref={menuRef}>
            <button
              className={`profile-trigger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <span className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
                {unreadCount > 0 && <span className="avatar-dot" />}
              </span>
              <span className="profile-trigger-name">{user.username}</span>
              <FontAwesomeIcon icon={faChevronDown} className="profile-caret" />
            </button>

            {menuOpen && (
              <div className="profile-dropdown" role="menu">
                <div className="profile-dropdown-header">
                  <span className="user-avatar">{user.username.charAt(0).toUpperCase()}</span>
                  <div className="profile-dropdown-info">
                    <span className="profile-dropdown-name">{user.username}</span>
                    <RoleBadge role={user.role} />
                  </div>
                </div>

                <Link to="/profile" className="profile-dropdown-item" onClick={() => setMenuOpen(false)} role="menuitem">
                  <FontAwesomeIcon icon={faUser} />
                  <span>My Profile</span>
                </Link>
                <Link to="/notifications" className="profile-dropdown-item" onClick={() => setMenuOpen(false)} role="menuitem">
                  <FontAwesomeIcon icon={faBell} />
                  <span>Notifications</span>
                  {unreadCount > 0 && <span className="notification-badge-inline">{unreadCount}</span>}
                </Link>

                <div className="profile-dropdown-divider" />

                <button
                  className="profile-dropdown-item danger"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

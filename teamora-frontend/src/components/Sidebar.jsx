import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { isAdmin, isTeamLeader, isTeamMember } = useAuth();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand-box">
          <div className="sidebar-brand-logo"><FontAwesomeIcon icon={faUsers} style={{ color: "rgb(250, 251, 252)" }} /></div>
          <div>
            <div className="sidebar-brand-title">TEAMORA</div>
            <div className="sidebar-brand-badge">
              {isAdmin && "Admin Portal"}
              {isTeamLeader && "Team Leader"}
              {isTeamMember && "Team Member"}
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-section-title">Navigation</span>
          <nav className="sidebar-nav">
            {isAdmin && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">📊</span>
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">👥</span>
                  <span>Manage Users</span>
                </NavLink>
                <NavLink
                  to="/admin/teams"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">🏢</span>
                  <span>Manage Teams</span>
                </NavLink>
                <NavLink
                  to="/admin/projects"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">📁</span>
                  <span>Manage Projects</span>
                </NavLink>
              </>
            )}

            {isTeamLeader && (
              <>
                <NavLink
                  to="/team-leader/dashboard"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">📊</span>
                  <span>Leader Dashboard</span>
                </NavLink>
                <NavLink
                  to="/team-leader/projects"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">📁</span>
                  <span>My Projects</span>
                </NavLink>
                <NavLink
                  to="/team-leader/team"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">👥</span>
                  <span>Assigned Team</span>
                </NavLink>
                <NavLink
                  to="/team-leader/tasks"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">✅</span>
                  <span>Tasks & Delegation</span>
                </NavLink>
                <NavLink
                  to="/team-leader/feedback"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">📝</span>
                  <span>Daily Feedbacks</span>
                </NavLink>
                <NavLink
                  to="/team-leader/performance"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">⭐</span>
                  <span>Performance Ratings</span>
                </NavLink>
              </>
            )}

            {isTeamMember && (
              <>
                <NavLink
                  to="/member/dashboard"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">📊</span>
                  <span>Member Dashboard</span>
                </NavLink>
                <NavLink
                  to="/member/tasks"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">📋</span>
                  <span>My Tasks</span>
                </NavLink>
                <NavLink
                  to="/member/daily-feedback"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">📝</span>
                  <span>Daily Work Log</span>
                </NavLink>
                <NavLink
                  to="/member/team"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="link-icon">🏢</span>
                  <span>My Team</span>
                </NavLink>
              </>
            )}

            <div className="sidebar-divider"></div>

            <NavLink
              to="/notifications"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="link-icon">🔔</span>
              <span>Notifications</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="link-icon">👤</span>
              <span>My Profile</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

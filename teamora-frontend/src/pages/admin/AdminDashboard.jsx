import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { RoleBadge, StatusBadge } from "../../components/Badge";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashStats, allUsers] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers()
      ]);
      setStats(dashStats);
      setUsers(allUsers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminService.approveUser(userId);
      setActionSuccess("User approved successfully!");
      setTimeout(() => setActionSuccess(""), 4000);
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject this registration?")) return;
    try {
      await adminService.rejectUser(userId);
      setActionSuccess("User registration rejected.");
      setTimeout(() => setActionSuccess(""), 4000);
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject user");
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const pendingUsers = users.filter((u) => u.status === "PENDING");

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
        </div>
      </div>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>👥</div>
          <div className="stat-content">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{stats?.totalUsers ?? 0}</span>
          </div>
        </div>

        <div className="stat-card" style={pendingUsers.length > 0 ? { border: "2px solid #c9962b" } : {}}>
          <div className="stat-icon" style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending Approvals</span>
            <span className="stat-value" style={{ color: pendingUsers.length > 0 ? "var(--warning)" : "inherit" }}>
              {stats?.pendingUsers ?? 0}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#C6DBEF", color: "var(--cyan-teal)" }}>⭐</div>
          <div className="stat-content">
            <span className="stat-label">Team Leaders</span>
            <span className="stat-value">{stats?.totalTeamLeaders ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#EFF3FF", color: "var(--slate-teal)" }}>👤</div>
          <div className="stat-content">
            <span className="stat-label">Team Members</span>
            <span className="stat-value">{stats?.totalTeamMembers ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--primary-light)", color: "var(--dark-teal)" }}>🏢</div>
          <div className="stat-content">
            <span className="stat-label">Total Teams</span>
            <span className="stat-value">{stats?.totalTeams ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#EFF3FF", color: "var(--ocean-teal)" }}>📁</div>
          <div className="stat-content">
            <span className="stat-label">Total Projects</span>
            <span className="stat-value">{stats?.totalProjects ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>✅</div>
          <div className="stat-content">
            <span className="stat-label">Completed Tasks</span>
            <span className="stat-value">{stats?.completedTasks ?? 0} / {stats?.totalTasks ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Callout */}
      {pendingUsers.length > 0 && (
        <div className="card" style={{ marginTop: "1.5rem", borderLeft: "4px solid var(--warning)" }}>
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 className="card-title" style={{ color: "var(--dark-teal)" }}>
                ⚠️ Pending User Registrations ({pendingUsers.length})
              </h3>
              <p className="card-subtitle">
                New accounts require Admin approval before they can sign in as Team Members.
              </p>
            </div>
            <Link to="/admin/users" className="btn btn-outline btn-sm">
              View All in User Management →
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(u.id)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(u.id)}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid-3" style={{ marginTop: "1.5rem", gap: "1.25rem" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">👥 User Management</h3>
            <p className="card-subtitle">Approve members, elevate members to Team Leaders, manage accounts.</p>
          </div>
          <div className="card-body">
            <Link to="/admin/users" className="btn btn-primary btn-block">
              Open User Manager
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🏢 Team Management</h3>
            <p className="card-subtitle">Create teams, assign designated Team Leaders, allocate members.</p>
          </div>
          <div className="card-body">
            <Link to="/admin/teams" className="btn btn-primary btn-block">
              Open Team Manager
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📁 Project Management</h3>
            <p className="card-subtitle">Create projects, assign them to Team Leaders, monitor progress.</p>
          </div>
          <div className="card-body">
            <Link to="/admin/projects" className="btn btn-primary btn-block">
              Open Project Manager
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
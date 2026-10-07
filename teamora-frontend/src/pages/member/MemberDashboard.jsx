import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { memberService } from "../../services/memberService";
import { PriorityBadge, StatusBadge } from "../../components/Badge";

const MemberDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await memberService.getDashboard();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load member dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (taskId) => {
    try {
      await memberService.startTask(taskId);
      setActionSuccess("Task started! Status is now In Progress.");
      setTimeout(() => setActionSuccess(""), 3500);
      loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await memberService.completeTask(taskId);
      setActionSuccess("Task marked as Completed! Great job!");
      setTimeout(() => setActionSuccess(""), 3500);
      loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete task");
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const team = stats?.team;
  const recentTasks = stats?.recentTasks || [];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Member Dashboard</h1>
        </div>
        <div className="header-actions">
          <Link to="/member/daily-feedback" className="btn btn-primary">
            📝 Submit Daily Log
          </Link>
          <Link to="/member/tasks" className="btn btn-secondary">
            📋 View All Tasks
          </Link>
        </div>
      </div>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>📋</div>
          <div className="stat-content">
            <span className="stat-label">Assigned Tasks</span>
            <span className="stat-value">{stats?.totalTasks ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>⏳</div>
          <div className="stat-content">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats?.inProgressTasks ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>✅</div>
          <div className="stat-content">
            <span className="stat-label">Completed Tasks</span>
            <span className="stat-value">{stats?.completedTasks ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#FDF4DD", color: "#8a6f1c" }}>⭐</div>
          <div className="stat-content">
            <span className="stat-label">Avg Performance Rating</span>
            <span className="stat-value">
              {stats?.averagePerformanceRating > 0
                ? `${stats.averagePerformanceRating} / 5`
                : "No ratings yet"}
            </span>
          </div>
        </div>
      </div>

      {/* Team & Leader info banner */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 className="card-title">🏢 Your Team & Leadership</h3>
            <p className="card-subtitle">
              {team ? `Assigned to ${team.teamName}` : "You have not been assigned to a team squad yet."}
            </p>
          </div>
          {team && (
            <Link to="/member/team" className="btn btn-outline btn-sm">
              View Squad Members →
            </Link>
          )}
        </div>
        {team && (
          <div className="card-body" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Designated Team Leader:</span>
              <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                {team.teamLeaderName ? (
                  <span className="badge badge-leader">⭐ {team.teamLeaderName}</span>
                ) : (
                  <span className="badge badge-neutral">Unassigned</span>
                )}
              </div>
            </div>
            <div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Squad Size:</span>
              <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>{team.memberCount || 0} Members</div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Assigned Tasks */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 className="card-title">Recent Tasks</h3>
            <p className="card-subtitle">Tasks assigned to you by your Team Leader</p>
          </div>
          <Link to="/member/tasks" className="btn btn-outline btn-sm">
            View All ({stats?.totalTasks ?? 0}) →
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            No tasks currently assigned to you.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link to={`/member/tasks/${t.id}`} style={{ fontWeight: 600 }}>
                        {t.title}
                      </Link>
                    </td>
                    <td><span className="badge badge-neutral">{t.projectName}</span></td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{t.deadline ? new Date(t.deadline).toLocaleDateString() : "-"}</td>
                    <td>
                      <div className="action-buttons">
                        {t.status === "ASSIGNED" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStartTask(t.id)}
                          >
                            ▶ Start
                          </button>
                        )}
                        {t.status === "IN_PROGRESS" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleCompleteTask(t.id)}
                          >
                            ✓ Complete
                          </button>
                        )}
                        <Link to={`/member/tasks/${t.id}`} className="btn btn-outline btn-sm">
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;

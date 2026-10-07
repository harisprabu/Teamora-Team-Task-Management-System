import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { teamLeaderService } from "../../services/teamLeaderService";
import { PriorityBadge, StatusBadge } from "../../components/Badge";

const TeamLeaderDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [progData, projData] = await Promise.all([
        teamLeaderService.getTeamProgress(),
        teamLeaderService.getProjects()
      ]);
      setProgress(progData);
      setProjects(projData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team leader metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const memberStats = progress?.memberStats || [];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Leader Dashboard</h1>
        </div>
        <div className="header-actions">
          <Link to="/team-leader/tasks" className="btn btn-primary">
            ➕ Create & Assign Task
          </Link>
          <Link to="/team-leader/feedback" className="btn btn-secondary">
            📝 Review Daily Feedbacks
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#EFF3FF", color: "var(--ocean-teal)" }}>📁</div>
          <div className="stat-content">
            <span className="stat-label">Assigned Projects</span>
            <span className="stat-value">{projects.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#C6DBEF", color: "var(--cyan-teal)" }}>👥</div>
          <div className="stat-content">
            <span className="stat-label">Team Members</span>
            <span className="stat-value">{progress?.totalTeamMembers ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--primary-light)", color: "var(--dark-teal)" }}>📋</div>
          <div className="stat-content">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{progress?.totalTasks ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>✅</div>
          <div className="stat-content">
            <span className="stat-label">Completed Tasks</span>
            <span className="stat-value">{progress?.completedTasks ?? 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>⏳</div>
          <div className="stat-content">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{progress?.inProgressTasks ?? 0}</span>
          </div>
        </div>

        <div className="stat-card" style={progress?.overdueTasks > 0 ? { border: "2px solid #d9534f" } : {}}>
          <div className="stat-icon" style={{ backgroundColor: "var(--danger-light)", color: "var(--danger)" }}>⚠️</div>
          <div className="stat-content">
            <span className="stat-label">Overdue Tasks</span>
            <span className="stat-value" style={{ color: progress?.overdueTasks > 0 ? "var(--danger)" : "inherit" }}>
              {progress?.overdueTasks ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header">
          <h3 className="card-title">Overall Team Execution Progress</h3>
          <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--primary)" }}>
            {progress?.overallProgress ?? 0}%
          </span>
        </div>
        <div className="card-body">
          <div className="progress-bar-container" style={{ height: "14px" }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progress?.overallProgress ?? 0}%`, backgroundColor: "var(--cyan-teal)" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Member Performance Breakdown */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 className="card-title">Assigned Team Members Progress</h3>
            <p className="card-subtitle">Performance breakdown of members allocated to your team by Admin</p>
          </div>
          <Link to="/team-leader/performance" className="btn btn-outline btn-sm">
            ⭐ Rate Member Performance
          </Link>
        </div>

        {memberStats.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
            No members are currently allocated to your squad. Contact the Admin to assign members.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Tasks Assigned</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>Completion Rate</th>
                  <th>Latest Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {memberStats.map((m) => (
                  <tr key={m.memberId}>
                    <td>
                      <strong>{m.memberName}</strong>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{m.email}</div>
                    </td>
                    <td>{m.assignedTasks}</td>
                    <td><span style={{ color: "var(--success)", fontWeight: 600 }}>{m.completedTasks}</span></td>
                    <td><span style={{ color: "var(--primary)", fontWeight: 600 }}>{m.inProgressTasks}</span></td>
                    <td style={{ minWidth: "150px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className="progress-bar-container" style={{ flex: 1 }}>
                          <div className="progress-bar-fill" style={{ width: `${m.completionPercentage}%` }}></div>
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{m.completionPercentage}%</span>
                      </div>
                    </td>
                    <td>
                      {m.performanceRating ? (
                        <span style={{ color: "#c9962b", fontWeight: 700 }}>
                          {"★".repeat(m.performanceRating)}{"☆".repeat(5 - m.performanceRating)} ({m.performanceRating}/5)
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Not rated yet</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/team-leader/performance?memberId=${m.memberId}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Rate Member
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assigned Projects Preview */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 className="card-title">My Assigned Projects</h3>
            <p className="card-subtitle">Projects allocated to you by Admin for execution</p>
          </div>
          <Link to="/team-leader/projects" className="btn btn-outline btn-sm">
            View All Projects →
          </Link>
        </div>

        {projects.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
            No projects have been assigned to you yet by Admin.
          </div>
        ) : (
          <div className="grid-2" style={{ gap: "1rem", padding: "1rem" }}>
            {projects.map((p) => {
              const comp = p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0;
              return (
                <div key={p.id} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "1.2rem", background: "#F7FAFE" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <h4 style={{ color: "var(--dark-teal)", fontSize: "1.1rem" }}>{p.projectName}</h4>
                    <PriorityBadge priority={p.priority} />
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    {p.description || "No description."}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                    <span>Tasks: {p.completedTasks} / {p.totalTasks}</span>
                    <strong>{comp}%</strong>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${comp}%` }}></div>
                  </div>
                  <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
                    <Link to={`/team-leader/tasks?projectId=${p.id}`} className="btn btn-primary btn-sm">
                      Split into Tasks →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";
import { StatusBadge, PriorityBadge } from "../../components/Badge";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard metrics");
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

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const completionRate = stats?.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="header-actions">
          <Link to="/tasks/create" className="btn btn-primary">
            + New Task
          </Link>
          <Link to="/teams/create" className="btn btn-secondary">
            + New Team
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-indigo">🏢</div>
          <div className="stat-content">
            <span className="stat-label">Total Teams</span>
            <span className="stat-value">{stats?.totalTeams || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-blue">📋</div>
          <div className="stat-content">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{stats?.totalTasks || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-slate">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending (TODO)</span>
            <span className="stat-value">{stats?.pendingTasks || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-amber">⚡</div>
          <div className="stat-content">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats?.inProgressTasks || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-emerald">✅</div>
          <div className="stat-content">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats?.completedTasks || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-rose">🔥</div>
          <div className="stat-content">
            <span className="stat-label">High Priority</span>
            <span className="stat-value">{stats?.highPriorityTasks || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-purple">⏰</div>
          <div className="stat-content">
            <span className="stat-label">Upcoming Deadlines</span>
            <span className="stat-value">{stats?.upcomingDeadlinesCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Progress & Overview Bar */}
      <div className="card dashboard-progress-card">
        <div className="card-header">
          <h3 className="card-title">Task Completion Progress</h3>
          <span className="badge badge-primary">{completionRate}% Done</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${completionRate}%` }}></div>
        </div>
        <div className="progress-legend">
          <span>TODO: {stats?.pendingTasks || 0}</span>
          <span>In Progress: {stats?.inProgressTasks || 0}</span>
          <span>Completed: {stats?.completedTasks || 0}</span>
        </div>
      </div>

      {/* Two columns: Recent Tasks & Your Teams */}
      <div className="dashboard-columns">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Tasks</h3>
            <Link to="/tasks" className="link-action">View all</Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Team</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentTasks && stats.recentTasks.length > 0 ? (
                  stats.recentTasks.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <Link to={`/tasks/${t.id}`} className="table-link">
                          {t.title}
                        </Link>
                      </td>
                      <td>{t.teamName || "-"}</td>
                      <td>{t.assignedToName || <span className="text-muted">Unassigned</span>}</td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td><StatusBadge status={t.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No tasks found. Create a task to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">My Teams</h3>
            <Link to="/teams" className="link-action">View all</Link>
          </div>
          <div className="teams-mini-list">
            {stats?.teams && stats.teams.length > 0 ? (
              stats.teams.map((team) => (
                <div key={team.id} className="team-mini-card">
                  <div className="team-mini-info">
                    <h4>
                      <Link to={`/teams/${team.id}`}>{team.teamName}</Link>
                    </h4>
                    <p className="team-mini-desc">{team.description || "No description provided."}</p>
                  </div>
                  <div className="team-mini-meta">
                    <span className="badge badge-neutral">👥 {team.memberCount} members</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-mini-state">
                <p className="text-muted">You are not part of any teams yet.</p>
                <Link to="/teams/create" className="btn btn-sm btn-primary mt-2">Create a Team</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { teamLeaderService } from "../../services/teamLeaderService";
import { PriorityBadge, StatusBadge } from "../../components/Badge";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await teamLeaderService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assigned projects");
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

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Assigned Projects</h1>
          <p className="page-subtitle">Projects delegated to you by the Administrator for execution and task breakdown</p>
        </div>
        <Link to="/team-leader/tasks" className="btn btn-primary">
          ➕ Break Project into Tasks
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
            You do not currently have any projects assigned to you.
          </p>
          <span style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
            Please contact the Administrator to assign a project to your leadership.
          </span>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: "1.5rem" }}>
          {projects.map((proj) => {
            const completion =
              proj.totalTasks > 0 ? Math.round((proj.completedTasks / proj.totalTasks) * 100) : 0;
            return (
              <div className="card" key={proj.id}>
                <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 className="card-title" style={{ fontSize: "1.25rem", color: "var(--dark-teal)" }}>
                      {proj.projectName}
                    </h3>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                      <PriorityBadge priority={proj.priority} />
                      <StatusBadge status={proj.status} />
                    </div>
                  </div>
                  <Link
                    to={`/team-leader/tasks?projectId=${proj.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Manage Tasks ({proj.totalTasks})
                  </Link>
                </div>

                <div className="card-body">
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                    {proj.description || "No description provided."}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Target Deadline:</span>
                      <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                        {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : "No Deadline"}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Task Count:</span>
                      <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                        {proj.completedTasks} / {proj.totalTasks} completed
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                      <span>Completion Rate</span>
                      <strong>{completion}%</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${completion}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProjects;

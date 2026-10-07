import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { memberService } from "../../services/memberService";
import { PriorityBadge, StatusBadge } from "../../components/Badge";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await memberService.getMyTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assigned tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (taskId) => {
    try {
      await memberService.startTask(taskId);
      setSuccess("Task marked as In Progress!");
      setTimeout(() => setSuccess(""), 3500);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start task");
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await memberService.completeTask(taskId);
      setSuccess("Task marked as Completed!");
      setTimeout(() => setSuccess(""), 3500);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete task");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Assigned Tasks</h1>
          <p className="page-subtitle">Track, start, update, and complete tasks assigned by your Team Leader</p>
        </div>
        <button className="btn btn-secondary" onClick={loadTasks}>
          ↻ Refresh Tasks
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter toolbar */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "0.8rem", display: "block", color: "var(--text-muted)" }}>Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ASSIGNED">Assigned (Not Started)</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", display: "block", color: "var(--text-muted)" }}>Priority</label>
            <select
              className="form-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task table */}
      <div className="card">
        {loading ? (
          <div className="flex-center" style={{ padding: "4rem" }}>
            <div className="spinner"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            No tasks found matching the criteria.
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div>
                        <Link to={`/member/tasks/${t.id}`} style={{ fontWeight: 600 }}>
                          {t.title}
                        </Link>
                        {t.description && (
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "280px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {t.description}
                          </div>
                        )}
                      </div>
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
                            ▶ Start Task
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
                          Comments & Details
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

export default MyTasks;

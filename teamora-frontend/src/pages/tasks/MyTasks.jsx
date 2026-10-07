import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { taskService } from "../../services/taskService";
import { StatusBadge, PriorityBadge } from "../../components/Badge";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getMyTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assigned tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await taskService.updateStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setActionMsg("Task status updated!");
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const filteredTasks = tasks.filter((t) =>
    statusFilter === "ALL" ? true : t.status === statusFilter
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Tasks specifically assigned to you across all teams</p>
        </div>
        <div className="header-actions">
          <Link to="/tasks/create" className="btn btn-primary">
            + Create Task
          </Link>
        </div>
      </div>

      {actionMsg && <div className="alert alert-success mb-4">{actionMsg}</div>}
      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="card filter-bar-card mb-4">
        <div className="status-filter-pills">
          <button
            className={`pill-btn ${statusFilter === "ALL" ? "active" : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            All ({tasks.length})
          </button>
          <button
            className={`pill-btn ${statusFilter === "TODO" ? "active" : ""}`}
            onClick={() => setStatusFilter("TODO")}
          >
            To Do ({tasks.filter((t) => t.status === "TODO").length})
          </button>
          <button
            className={`pill-btn ${statusFilter === "IN_PROGRESS" ? "active" : ""}`}
            onClick={() => setStatusFilter("IN_PROGRESS")}
          >
            In Progress ({tasks.filter((t) => t.status === "IN_PROGRESS").length})
          </button>
          <button
            className={`pill-btn ${statusFilter === "COMPLETED" ? "active" : ""}`}
            onClick={() => setStatusFilter("COMPLETED")}
          >
            Completed ({tasks.filter((t) => t.status === "COMPLETED").length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: "40vh" }}>
          <div className="spinner"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🎉</div>
          <h3>No tasks in this view</h3>
          <p className="text-muted">You have no tasks assigned matching this filter.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Team</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <Link to={`/tasks/${task.id}`} className="table-link font-semibold">
                        {task.title}
                      </Link>
                      {task.description && (
                        <p className="task-table-desc text-muted">{task.description}</p>
                      )}
                    </td>
                    <td>
                      <Link to={`/teams/${task.teamId}`} className="text-sm">
                        {task.teamName}
                      </Link>
                    </td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    <td>
                      <span className="text-sm">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-dropdown"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`/tasks/${task.id}`} className="btn btn-outline btn-xs">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;

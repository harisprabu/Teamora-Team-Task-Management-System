import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { taskService } from "../../services/taskService";
import { StatusBadge, PriorityBadge } from "../../components/Badge";
import Modal from "../../components/Modal";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState({ text: "", type: "" });

  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteTaskTitle, setDeleteTaskTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await taskService.updateStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setActionMsg({ text: "Task status updated!", type: "success" });
      setTimeout(() => setActionMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      setActionMsg({ text: "Failed to update status", type: "danger" });
    }
  };

  const confirmDelete = (task) => {
    setDeleteTaskId(task.id);
    setDeleteTaskTitle(task.title);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await taskService.deleteTask(deleteTaskId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
      setActionMsg({ text: `Task deleted successfully`, type: "success" });
      setIsDeleteModalOpen(false);
    } catch (err) {
      setActionMsg({ text: "Failed to delete task", type: "danger" });
      setIsDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Tasks</h1>
          <p className="page-subtitle">Administrative oversight and moderation of all tasks</p>
        </div>
        <div className="header-actions">
          <Link to="/tasks/create" className="btn btn-primary">
            + Create Task
          </Link>
          <Link to="/admin/dashboard" className="btn btn-secondary">
            &larr; Back to Admin
          </Link>
        </div>
      </div>

      {actionMsg.text && (
        <div className={`alert alert-${actionMsg.type} mb-4`}>{actionMsg.text}</div>
      )}

      {/* Filter Toolbar */}
      <div className="card filter-bar-card mb-4">
        <div className="filters-grid">
          <div className="filter-item search-filter">
            <label>Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Priority</label>
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

      {loading ? (
        <div className="flex-center" style={{ minHeight: "40vh" }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Team</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link to={`/tasks/${t.id}`} className="table-link font-semibold">
                        {t.title}
                      </Link>
                    </td>
                    <td>{t.teamName}</td>
                    <td>{t.assignedToName ? `@${t.assignedToName}` : <span className="text-muted">Unassigned</span>}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td>
                      <select
                        className="status-dropdown"
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>
                    <td>
                      <div className="table-action-btns">
                        <Link to={`/tasks/${t.id}`} className="btn btn-outline btn-xs">
                          View
                        </Link>
                        <Link to={`/tasks/edit/${t.id}`} className="btn btn-secondary btn-xs">
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger-outline btn-xs"
                          onClick={() => confirmDelete(t)}
                        >
                          Delete
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

      {/* Delete Task Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Task Deletion"
      >
        <p className="mb-4">
          Are you sure you want to permanently delete task <strong>"{deleteTaskTitle}"</strong>?
        </p>
        <div className="form-actions">
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Task"}
          </button>
          <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageTasks;

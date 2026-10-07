import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { taskService } from "../../services/taskService";
import { StatusBadge, PriorityBadge } from "../../components/Badge";
import Modal from "../../components/Modal";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState({ text: "", type: "" });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTaskById(id);
      setTask(data);
    } catch (err) {
      setError(err.response?.data?.message || "Task not found");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await taskService.updateStatus(id, newStatus);
      setTask(updated);
      setActionMsg({ text: `Task status updated to ${newStatus}`, type: "success" });
      setTimeout(() => setActionMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      setActionMsg({
        text: err.response?.data?.message || "Failed to update status",
        type: "danger"
      });
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await taskService.deleteTask(id);
      navigate("/tasks");
    } catch (err) {
      setActionMsg({
        text: err.response?.data?.message || "Failed to delete task",
        type: "danger"
      });
      setIsDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "50vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error || "Task not found"}</div>
        <Link to="/tasks" className="btn btn-secondary mt-3">&larr; Back to Tasks</Link>
      </div>
    );
  }

  const isOverdue =
    task.dueDate &&
    task.status !== "COMPLETED" &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/tasks">Tasks</Link> / <span>{task.title}</span>
          </div>
          <h1 className="page-title">{task.title}</h1>
        </div>
        <div className="header-actions">
          <Link to={`/tasks/edit/${task.id}`} className="btn btn-secondary">
            Edit Task
          </Link>
          <button className="btn btn-danger-outline" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </button>
        </div>
      </div>

      {actionMsg.text && (
        <div className={`alert alert-${actionMsg.type} mb-4`}>{actionMsg.text}</div>
      )}

      {isOverdue && (
        <div className="alert alert-danger mb-4">
          ⚠️ This task is past its due date ({new Date(task.dueDate).toLocaleDateString()})!
        </div>
      )}

      <div className="details-columns">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Description</h3>
          </div>
          <div className="task-full-description">
            {task.description ? (
              <p style={{ whiteSpace: "pre-wrap" }}>{task.description}</p>
            ) : (
              <p className="text-muted">No description provided for this task.</p>
            )}
          </div>

          <div className="status-changer-box mt-4">
            <label className="font-semibold mb-2 block">Change Status:</label>
            <div className="status-button-group">
              <button
                className={`btn btn-sm ${task.status === "TODO" ? "btn-primary" : "btn-outline"}`}
                onClick={() => handleStatusChange("TODO")}
              >
                To Do
              </button>
              <button
                className={`btn btn-sm ${task.status === "IN_PROGRESS" ? "btn-primary" : "btn-outline"}`}
                onClick={() => handleStatusChange("IN_PROGRESS")}
              >
                In Progress
              </button>
              <button
                className={`btn btn-sm ${task.status === "COMPLETED" ? "btn-success" : "btn-outline"}`}
                onClick={() => handleStatusChange("COMPLETED")}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Properties</h3>
          </div>
          <div className="property-list">
            <div className="property-item">
              <span className="property-label">Status</span>
              <StatusBadge status={task.status} />
            </div>

            <div className="property-item">
              <span className="property-label">Priority</span>
              <PriorityBadge priority={task.priority} />
            </div>

            <div className="property-item">
              <span className="property-label">Due Date</span>
              <span className={`property-value ${isOverdue ? "text-danger font-semibold" : ""}`}>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
              </span>
            </div>

            <div className="property-item">
              <span className="property-label">Team</span>
              <Link to={`/teams/${task.teamId}`} className="property-link">
                {task.teamName || `Team #${task.teamId}`}
              </Link>
            </div>

            <div className="property-item">
              <span className="property-label">Assigned To</span>
              <span className="property-value">
                {task.assignedToName ? `@${task.assignedToName}` : <span className="text-muted">Unassigned</span>}
              </span>
            </div>

            <div className="property-item">
              <span className="property-label">Created By</span>
              <span className="property-value">@{task.createdByName || "User"}</span>
            </div>

            <div className="property-item">
              <span className="property-label">Created At</span>
              <span className="property-value text-xs text-muted">
                {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
              </span>
            </div>

            <div className="property-item">
              <span className="property-label">Last Updated</span>
              <span className="property-value text-xs text-muted">
                {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Task Deletion"
      >
        <p className="mb-4">
          Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be reversed.
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

export default TaskDetails;

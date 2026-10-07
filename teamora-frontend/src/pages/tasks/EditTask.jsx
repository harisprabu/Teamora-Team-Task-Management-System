import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { taskService } from "../../services/taskService";
import { teamService } from "../../services/teamService";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    teamId: "",
    assignedToId: ""
  });

  useEffect(() => {
    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (formData.teamId) {
      loadTeamMembers(formData.teamId);
    }
  }, [formData.teamId]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      const [task, allTeams] = await Promise.all([
        taskService.getTaskById(id),
        teamService.getAllTeams()
      ]);

      setTeams(allTeams);
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate || "",
        teamId: task.teamId ? String(task.teamId) : "",
        assignedToId: task.assignedToId ? String(task.assignedToId) : ""
      });

      if (task.teamId) {
        await loadTeamMembers(task.teamId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load task details");
    } finally {
      setInitialLoading(false);
    }
  };

  const loadTeamMembers = async (teamId) => {
    try {
      const data = await teamService.getTeamMembers(teamId);
      setMembers(data);
    } catch (err) {
      setMembers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Task title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || null,
        teamId: formData.teamId ? Number(formData.teamId) : null,
        assignedToId: formData.assignedToId ? Number(formData.assignedToId) : null
      };

      await taskService.updateTask(id, payload);
      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex-center" style={{ minHeight: "50vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container form-page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Task</h1>
          <p className="page-subtitle">Update task properties, assignee, status, or deadline</p>
        </div>
        <Link to={`/tasks/${id}`} className="btn btn-secondary">
          &larr; Back to Task
        </Link>
      </div>

      <div className="card form-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="teamId">Team *</label>
              <select
                id="teamId"
                name="teamId"
                className="form-control"
                value={formData.teamId}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">-- Select Team --</option>
                {teams.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.teamName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignedToId">Assign To</label>
              <select
                id="assignedToId"
                name="assignedToId"
                className="form-control"
                value={formData.assignedToId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">-- Unassigned --</option>
                {members.map((m) => (
                  <option key={m.id} value={String(m.userId)}>
                    {m.username} ({m.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link to={`/tasks/${id}`} className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;

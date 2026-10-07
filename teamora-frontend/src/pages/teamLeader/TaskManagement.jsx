import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { teamLeaderService } from "../../services/teamLeaderService";
import { PriorityBadge, StatusBadge } from "../../components/Badge";
import Modal from "../../components/Modal";

const TaskManagement = () => {
  const [searchParams] = useSearchParams();
  const preselectedProjectId = searchParams.get("projectId");
  const preselectedMemberId = searchParams.get("assignTo");

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [projectFilter, setProjectFilter] = useState(preselectedProjectId || "ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: preselectedProjectId || "",
    assignedMemberId: preselectedMemberId || "",
    priority: "MEDIUM",
    deadline: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData, membersData] = await Promise.all([
        teamLeaderService.getTasks(),
        teamLeaderService.getProjects(),
        teamLeaderService.getMembers()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setMembers(membersData);

      if (preselectedProjectId) {
        setFormData((prev) => ({ ...prev, projectId: preselectedProjectId }));
      }
      if (preselectedMemberId) {
        setFormData((prev) => ({ ...prev, assignedMemberId: preselectedMemberId }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks and projects");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      title: "",
      description: "",
      projectId: preselectedProjectId || (projects[0]?.id ? String(projects[0].id) : ""),
      assignedMemberId: preselectedMemberId || "",
      priority: "MEDIUM",
      deadline: ""
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) {
      setError("Please select a project to assign this task to");
      return;
    }
    try {
      await teamLeaderService.createTask({
        title: formData.title,
        description: formData.description,
        projectId: Number(formData.projectId),
        assignedMemberId: formData.assignedMemberId ? Number(formData.assignedMemberId) : null,
        priority: formData.priority,
        deadline: formData.deadline || null
      });
      setShowCreateModal(false);
      setSuccess("Task created and assigned successfully!");
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleOpenEdit = (task) => {
    setActiveTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      projectId: task.projectId ? String(task.projectId) : "",
      assignedMemberId: task.assignedMemberId ? String(task.assignedMemberId) : "",
      priority: task.priority || "MEDIUM",
      deadline: task.deadline || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await teamLeaderService.updateTask(activeTask.id, {
        title: formData.title,
        description: formData.description,
        assignedMemberId: formData.assignedMemberId ? Number(formData.assignedMemberId) : null,
        priority: formData.priority,
        deadline: formData.deadline || null
      });
      setShowEditModal(false);
      setSuccess("Task updated successfully!");
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!window.confirm(`Delete task "${taskTitle}"?`)) return;
    try {
      await teamLeaderService.deleteTask(taskId);
      setSuccess("Task deleted successfully.");
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchProj = projectFilter === "ALL" || String(t.projectId) === String(projectFilter);
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchProj && matchStatus && matchPriority;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks & Delegation</h1>
          <p className="page-subtitle">Break assigned projects into tasks and delegate them to squad members</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleOpenCreate}
          disabled={projects.length === 0}
        >
          ➕ Create Task
        </button>
      </div>

      {projects.length === 0 && (
        <div className="alert alert-warning">
          ⚠️ You have not been assigned any projects by the Administrator yet. An assigned project is required before creating tasks.
        </div>
      )}

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter toolbar */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "0.8rem", display: "block", color: "var(--text-muted)" }}>Project</label>
            <select
              className="form-control"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", display: "block", color: "var(--text-muted)" }}>Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ASSIGNED">Assigned</option>
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

          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn btn-secondary" onClick={loadData}>
              ↻ Refresh
            </button>
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
            No tasks found. Click "+ Create Task" to break down an assigned project.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Project</th>
                  <th>Assigned To</th>
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
                        <strong>{t.title}</strong>
                        {t.description && (
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "260px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {t.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{t.projectName}</span></td>
                    <td>
                      {t.assignedMemberName ? (
                        <span className="badge badge-member">👤 {t.assignedMemberName}</span>
                      ) : (
                        <span className="badge badge-neutral">Unassigned</span>
                      )}
                    </td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{t.deadline ? new Date(t.deadline).toLocaleDateString() : "-"}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(t)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(t.id, t.title)}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE TASK MODAL */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create & Assign Task">
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label>Project *</label>
            <select
              className="form-control"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
            >
              <option value="">-- Select Project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Implement OAuth2 login flow"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description & Scope</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Detailed instructions for the assigned member..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="grid-2" style={{ gap: "1rem" }}>
            <div className="form-group">
              <label>Assign to Team Member</label>
              <select
                className="form-control"
                value={formData.assignedMemberId}
                onChange={(e) => setFormData({ ...formData, assignedMemberId: e.target.value })}
              >
                <option value="">-- Unassigned --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.username} ({m.email})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                * Restricted to members allocated to your team squad.
              </span>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              className="form-control"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Assign Task
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT TASK MODAL */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Task: ${activeTask?.title}`}>
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="grid-2" style={{ gap: "1rem" }}>
            <div className="form-group">
              <label>Assignee</label>
              <select
                className="form-control"
                value={formData.assignedMemberId}
                onChange={(e) => setFormData({ ...formData, assignedMemberId: e.target.value })}
              >
                <option value="">-- Unassigned --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.username} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              className="form-control"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskManagement;

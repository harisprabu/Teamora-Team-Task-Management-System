import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { PriorityBadge, StatusBadge } from "../../components/Badge";
import Modal from "../../components/Modal";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    priority: "MEDIUM",
    status: "PLANNING",
    deadline: "",
    assignedTeamLeaderId: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, usersData] = await Promise.all([
        adminService.getProjects(),
        adminService.getUsers()
      ]);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      projectName: "",
      description: "",
      priority: "MEDIUM",
      status: "PLANNING",
      deadline: "",
      assignedTeamLeaderId: ""
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createProject({
        projectName: formData.projectName,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        deadline: formData.deadline || null,
        assignedTeamLeaderId: formData.assignedTeamLeaderId ? Number(formData.assignedTeamLeaderId) : null
      });
      setShowCreateModal(false);
      setSuccess("Project created successfully and assigned to Team Leader!");
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleOpenEdit = (proj) => {
    setActiveProject(proj);
    setFormData({
      projectName: proj.projectName,
      description: proj.description || "",
      priority: proj.priority || "MEDIUM",
      status: proj.status || "PLANNING",
      deadline: proj.deadline || "",
      assignedTeamLeaderId: proj.assignedTeamLeaderId || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateProject(activeProject.id, {
        projectName: formData.projectName,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        deadline: formData.deadline || null,
        assignedTeamLeaderId: formData.assignedTeamLeaderId ? Number(formData.assignedTeamLeaderId) : null
      });
      setShowEditModal(false);
      setSuccess("Project updated successfully!");
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
    }
  };

  const handleDeleteProject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete project "${name}"? All associated tasks will also be deleted.`)) return;
    try {
      await adminService.deleteProject(id);
      setSuccess(`Project "${name}" deleted.`);
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  const approvedLeaders = users.filter((u) => u.status === "APPROVED");

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Management</h1>
          <p className="page-subtitle">Initiate strategic projects and delegate them directly to Team Leaders</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          ➕ Create Project
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="flex-center" style={{ padding: "4rem" }}>
          <div className="spinner"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>No projects have been initiated yet.</p>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: "1.5rem" }}>
          {projects.map((proj) => {
            const completion = proj.totalTasks > 0 ? Math.round((proj.completedTasks / proj.totalTasks) * 100) : 0;
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
                  <div className="action-buttons">
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(proj)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProject(proj.id, proj.projectName)}>
                      🗑
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                    {proj.description || "No description provided."}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.9rem", marginBottom: "1rem" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Assigned Team Leader:</span>
                      <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                        {proj.assignedTeamLeaderName ? (
                          <span className="badge badge-leader">⭐ {proj.assignedTeamLeaderName}</span>
                        ) : (
                          <span className="badge badge-neutral">Unassigned</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Target Deadline:</span>
                      <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                        {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : "No Deadline"}
                      </div>
                    </div>
                  </div>

                  {/* Progress section */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                      <span>Task Progress ({proj.completedTasks || 0} / {proj.totalTasks || 0} completed)</span>
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

      {/* CREATE PROJECT MODAL */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Project">
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Mobile Banking App 2.0"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Project scope and deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="grid-2" style={{ gap: "1rem" }}>
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

            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: "1rem" }}>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                className="form-control"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Assign to Team Leader</label>
              <select
                className="form-control"
                value={formData.assignedTeamLeaderId}
                onChange={(e) => setFormData({ ...formData, assignedTeamLeaderId: e.target.value })}
              >
                <option value="">-- Select Team Leader --</option>
                {approvedLeaders.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT PROJECT MODAL */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Project: ${activeProject?.projectName}`}>
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              className="form-control"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
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

            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: "1rem" }}>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                className="form-control"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Assigned Team Leader</label>
              <select
                className="form-control"
                value={formData.assignedTeamLeaderId}
                onChange={(e) => setFormData({ ...formData, assignedTeamLeaderId: e.target.value })}
              >
                <option value="">-- No Leader / Unassign --</option>
                {approvedLeaders.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>
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

export default ManageProjects;

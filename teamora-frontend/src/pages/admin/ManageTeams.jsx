import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import Modal from "../../components/Modal";

const ManageTeams = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const [activeTeam, setActiveTeam] = useState(null);
  const [formData, setFormData] = useState({
    teamName: "",
    description: "",
    teamLeaderId: ""
  });
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, usersData] = await Promise.all([
        adminService.getTeams(),
        adminService.getUsers()
      ]);
      setTeams(teamsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({ teamName: "", description: "", teamLeaderId: "" });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createTeam({
        teamName: formData.teamName,
        description: formData.description,
        teamLeaderId: formData.teamLeaderId ? Number(formData.teamLeaderId) : null
      });
      setShowCreateModal(false);
      setSuccess("Team created successfully!");
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create team");
    }
  };

  const handleOpenEdit = (team) => {
    setActiveTeam(team);
    setFormData({
      teamName: team.teamName,
      description: team.description || "",
      teamLeaderId: team.teamLeaderId || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateTeam(activeTeam.id, {
        teamName: formData.teamName,
        description: formData.description,
        teamLeaderId: formData.teamLeaderId ? Number(formData.teamLeaderId) : null
      });
      setShowEditModal(false);
      setSuccess("Team updated successfully!");
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update team");
    }
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to delete team "${teamName}"?`)) return;
    try {
      await adminService.deleteTeam(teamId);
      setSuccess(`Team "${teamName}" deleted.`);
      setTimeout(() => setSuccess(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete team");
    }
  };

  const handleOpenMembers = (team) => {
    setActiveTeam(team);
    setSelectedMemberToAdd("");
    setShowMembersModal(true);
  };

  const handleAddMember = async () => {
    if (!selectedMemberToAdd) return;
    try {
      await adminService.addMemberToTeam(activeTeam.id, Number(selectedMemberToAdd));
      setSuccess("Member assigned to team successfully!");
      setTimeout(() => setSuccess(""), 3500);
      // Refresh active team and list
      const updatedTeams = await adminService.getTeams();
      setTeams(updatedTeams);
      const curr = updatedTeams.find((t) => t.id === activeTeam.id);
      if (curr) setActiveTeam(curr);
      setSelectedMemberToAdd("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member to team");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the team?")) return;
    try {
      await adminService.removeMemberFromTeam(activeTeam.id, userId);
      setSuccess("Member removed from team.");
      setTimeout(() => setSuccess(""), 3500);
      const updatedTeams = await adminService.getTeams();
      setTeams(updatedTeams);
      const curr = updatedTeams.find((t) => t.id === activeTeam.id);
      if (curr) setActiveTeam(curr);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  // Approved users available for Team Leader selection
  const approvedLeaders = users.filter((u) => u.status === "APPROVED");
  // Approved members not already in active team
  const availableMembers = users.filter(
    (u) =>
      u.status === "APPROVED" &&
      activeTeam &&
      !activeTeam.members?.some((m) => m.id === u.id)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Management</h1>
          <p className="page-subtitle">Organize squads, designate Team Leaders, and allocate members</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          ➕ Create New Team
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="flex-center" style={{ padding: "4rem" }}>
          <div className="spinner"></div>
        </div>
      ) : teams.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>No teams have been created yet.</p>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            Create First Team
          </button>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: "1.5rem" }}>
          {teams.map((team) => (
            <div className="card" key={team.id}>
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 className="card-title" style={{ fontSize: "1.25rem", color: "var(--dark-teal)" }}>
                    {team.teamName}
                  </h3>
                  <p className="card-subtitle">{team.description || "No description provided."}</p>
                </div>
                <div className="action-buttons">
                  <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(team)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTeam(team.id, team.teamName)}>
                    🗑
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <strong>Assigned Team Leader:</strong>
                  {team.teamLeaderName ? (
                    <span className="badge badge-leader">⭐ {team.teamLeaderName}</span>
                  ) : (
                    <span className="badge badge-neutral">Unassigned</span>
                  )}
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <strong>Team Members ({team.memberCount || 0}):</strong>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleOpenMembers(team)}>
                      👥 Manage Members
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {team.members && team.members.length > 0 ? (
                      team.members.map((m) => (
                        <span key={m.id} className="badge badge-member">
                          👤 {m.username}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        No members assigned to this team yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Team">
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label>Team Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Frontend Engineering or Alpha Squad"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Primary responsibilities or team objectives..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Designate Team Leader</label>
            <select
              className="form-control"
              value={formData.teamLeaderId}
              onChange={(e) => setFormData({ ...formData, teamLeaderId: e.target.value })}
            >
              <option value="">-- Select Team Leader (Optional) --</option>
              {approvedLeaders.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Team
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT TEAM MODAL */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Team: ${activeTeam?.teamName}`}>
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label>Team Name *</label>
            <input
              type="text"
              className="form-control"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
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

          <div className="form-group">
            <label>Assigned Team Leader</label>
            <select
              className="form-control"
              value={formData.teamLeaderId}
              onChange={(e) => setFormData({ ...formData, teamLeaderId: e.target.value })}
            >
              <option value="">-- No Leader / Unassign --</option>
              {approvedLeaders.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>
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

      {/* MANAGE MEMBERS MODAL */}
      <Modal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title={`Manage Members: ${activeTeam?.teamName}`}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
            Add Member to Team:
          </label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <select
              className="form-control"
              value={selectedMemberToAdd}
              onChange={(e) => setSelectedMemberToAdd(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">-- Select approved member --</option>
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.username} ({m.email})
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleAddMember}
              disabled={!selectedMemberToAdd}
            >
              ➕ Add
            </button>
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
            Current Members in {activeTeam?.teamName}:
          </label>
          {activeTeam?.members && activeTeam.members.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTeam.members.map((m) => (
                    <tr key={m.id}>
                      <td><strong>{m.username}</strong></td>
                      <td>{m.email}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveMember(m.id)}
                        >
                          ✕ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No members in this team yet.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageTeams;

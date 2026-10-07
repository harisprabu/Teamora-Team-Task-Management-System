import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { teamService } from "../../services/teamService";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import { RoleBadge } from "../../components/Badge";

const TeamMembers = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState({ text: "", type: "" });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamData, membersData] = await Promise.all([
        teamService.getTeamById(id),
        teamService.getTeamMembers(id)
      ]);
      setTeam(teamData);
      setMembers(membersData);

      try {
        const usersList = await userService.getAllUsers();
        setAllUsers(usersList);
      } catch (e) {}
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      setAddingMember(true);
      await teamService.addMember(id, { userId: Number(selectedUserId) });
      setActionMsg({ text: "Member added successfully!", type: "success" });
      setIsAddModalOpen(false);
      setSelectedUserId("");
      const updatedMembers = await teamService.getTeamMembers(id);
      setMembers(updatedMembers);
    } catch (err) {
      setActionMsg({
        text: err.response?.data?.message || "Failed to add member",
        type: "danger"
      });
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to remove @${username} from this team?`)) {
      return;
    }

    try {
      await teamService.removeMember(id, userId);
      setActionMsg({ text: `@${username} removed from team`, type: "success" });
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err) {
      setActionMsg({
        text: err.response?.data?.message || "Failed to remove member",
        type: "danger"
      });
    }
  };

  const isOwner = team?.createdById === user?.id || isAdmin;
  const memberUserIds = new Set(members.map((m) => m.userId));
  const availableUsers = allUsers.filter((u) => !memberUserIds.has(u.id));

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "50vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/teams">Teams</Link> / <Link to={`/teams/${team?.id}`}>{team?.teamName}</Link> / <span>Members</span>
          </div>
          <h1 className="page-title">{team?.teamName} &mdash; Members</h1>
          <p className="page-subtitle">Manage people assigned to this team</p>
        </div>
        <div className="header-actions">
          {isOwner && (
            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
              + Add Member
            </button>
          )}
          <Link to={`/teams/${id}`} className="btn btn-secondary">
            &larr; Back to Team
          </Link>
        </div>
      </div>

      {actionMsg.text && (
        <div className={`alert alert-${actionMsg.type} mb-4`}>{actionMsg.text}</div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                {isOwner && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="user-table-cell">
                      <div className="avatar-small">
                        {m.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-semibold">{m.username}</span>
                      {m.userId === team.createdById && (
                        <span className="badge badge-warning ml-2">Team Owner</span>
                      )}
                    </div>
                  </td>
                  <td>{m.email}</td>
                  <td><RoleBadge role={m.role} /></td>
                  <td>{m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "-"}</td>
                  {isOwner && (
                    <td>
                      {m.userId !== team.createdById ? (
                        <button
                          className="btn btn-danger-outline btn-xs"
                          onClick={() => handleRemoveMember(m.userId, m.username)}
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-muted text-xs">Cannot remove owner</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Member to Team"
      >
        <form onSubmit={handleAddMember}>
          <div className="form-group">
            <label htmlFor="userSelect">Select User</label>
            <select
              id="userSelect"
              className="form-control"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">-- Select user to add --</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={addingMember || !selectedUserId}>
              {addingMember ? "Adding..." : "Add Member"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamMembers;

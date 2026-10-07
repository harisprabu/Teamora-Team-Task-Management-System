import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { teamService } from "../../services/teamService";
import { taskService } from "../../services/taskService";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import { StatusBadge, PriorityBadge, RoleBadge } from "../../components/Badge";

const TeamDetails = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState({ text: "", type: "" });

  // Add Member Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  // Delete Team Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, [id]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const [teamData, membersData, tasksData] = await Promise.all([
        teamService.getTeamById(id),
        teamService.getTeamMembers(id),
        taskService.getTasksByTeam(id)
      ]);
      setTeam(teamData);
      setMembers(membersData);
      setTasks(tasksData);

      // Preload users for add member dropdown
      try {
        const usersList = await userService.getAllUsers();
        setAllUsers(usersList);
      } catch (e) {
        // non-admin might have limited user list or permitted
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team details");
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
      // Refresh members
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

  const handleDeleteTeam = async () => {
    try {
      setDeletingTeam(true);
      await teamService.deleteTeam(id);
      navigate("/teams");
    } catch (err) {
      setActionMsg({
        text: err.response?.data?.message || "Failed to delete team",
        type: "danger"
      });
      setIsDeleteModalOpen(false);
    } finally {
      setDeletingTeam(false);
    }
  };

  const isOwner = team?.createdById === user?.id || isAdmin;

  // Users who are not yet members
  const memberUserIds = new Set(members.map((m) => m.userId));
  const availableUsers = allUsers.filter((u) => !memberUserIds.has(u.id));

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "50vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error || "Team not found"}</div>
        <Link to="/teams" className="btn btn-secondary mt-3">&larr; Back to Teams</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/teams">Teams</Link> / <span>{team.teamName}</span>
          </div>
          <h1 className="page-title">{team.teamName}</h1>
          <p className="page-subtitle">{team.description || "No description provided."}</p>
        </div>
        <div className="header-actions">
          {isOwner && (
            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
              + Add Member
            </button>
          )}
          <Link to={`/tasks/create?teamId=${team.id}`} className="btn btn-secondary">
            + Add Task
          </Link>
          {isOwner && (
            <button className="btn btn-danger-outline" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Team
            </button>
          )}
        </div>
      </div>

      {actionMsg.text && (
        <div className={`alert alert-${actionMsg.type} mb-4`}>{actionMsg.text}</div>
      )}

      {/* Meta Bar */}
      <div className="team-meta-bar card">
        <div className="meta-pill">
          <span className="pill-label">Creator:</span>
          <span className="pill-value">@{team.createdByUsername}</span>
        </div>
        <div className="meta-pill">
          <span className="pill-label">Total Members:</span>
          <span className="pill-value">{members.length}</span>
        </div>
        <div className="meta-pill">
          <span className="pill-label">Total Tasks:</span>
          <span className="pill-value">{tasks.length}</span>
        </div>
        <div className="meta-pill">
          <span className="pill-label">Created:</span>
          <span className="pill-value">
            {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : "-"}
          </span>
        </div>
      </div>

      <div className="details-columns">
        {/* Members Column */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Team Members ({members.length})</h3>
            <Link to={`/teams/${team.id}/members`} className="link-action">Manage</Link>
          </div>
          <div className="members-list">
            {members.map((m) => (
              <div key={m.id} className="member-item">
                <div className="member-avatar">
                  {m.username?.charAt(0)?.toUpperCase()}
                </div>
                <div className="member-info">
                  <div className="member-name-row">
                    <span className="member-username">{m.username}</span>
                    <RoleBadge role={m.role} />
                  </div>
                  <span className="member-email text-muted">{m.email}</span>
                </div>
                {isOwner && m.userId !== team.createdById && (
                  <button
                    className="btn btn-outline btn-xs"
                    onClick={() => handleRemoveMember(m.userId, m.username)}
                    title="Remove from team"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks in Team Column */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Team Tasks ({tasks.length})</h3>
            <Link to={`/tasks/create?teamId=${team.id}`} className="link-action">+ New Task</Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <Link to={`/tasks/${task.id}`} className="table-link">
                          {task.title}
                        </Link>
                      </td>
                      <td>{task.assignedToName || <span className="text-muted">Unassigned</span>}</td>
                      <td><PriorityBadge priority={task.priority} /></td>
                      <td><StatusBadge status={task.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No tasks created for this team yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
            <label htmlFor="memberSelect">Select User</label>
            <select
              id="memberSelect"
              className="form-control"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">-- Choose a user --</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.email}) - {u.role}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={addingMember || !selectedUserId}>
              {addingMember ? "Adding..." : "Add to Team"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Team Deletion"
      >
        <p className="mb-4">
          Are you sure you want to delete <strong>{team.teamName}</strong>? All associated team memberships and team tasks will also be deleted. This action cannot be undone.
        </p>
        <div className="form-actions">
          <button className="btn btn-danger" onClick={handleDeleteTeam} disabled={deletingTeam}>
            {deletingTeam ? "Deleting..." : "Yes, Delete Team"}
          </button>
          <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TeamDetails;

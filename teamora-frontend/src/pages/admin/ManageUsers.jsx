import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { RoleBadge, StatusBadge } from "../../components/Badge";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveUser(id);
      setSuccess("User approved successfully!");
      setTimeout(() => setSuccess(""), 3500);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error approving user");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this registration?")) return;
    try {
      await adminService.rejectUser(id);
      setSuccess("User registration rejected.");
      setTimeout(() => setSuccess(""), 3500);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error rejecting user");
    }
  };

  const handlePromoteToLeader = async (id) => {
    if (!window.confirm("Promote this user to Team Leader?")) return;
    try {
      await adminService.updateUserRole(id, "TEAM_LEADER");
      setSuccess("User promoted to Team Leader!");
      setTimeout(() => setSuccess(""), 3500);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error changing user role");
    }
  };

  const handleDemoteToMember = async (id) => {
    if (!window.confirm("Demote this user to Team Member?")) return;
    try {
      await adminService.updateUserRole(id, "TEAM_MEMBER");
      setSuccess("User changed to Team Member.");
      setTimeout(() => setSuccess(""), 3500);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error changing user role");
    }
  };

  const handleDeactivate = async (id) => {
    const reason = window.prompt("Enter deactivation reason (optional):");
    if (reason === null) return;
    try {
      await adminService.deactivateUser(id, reason);
      setSuccess("User account deactivated.");
      setTimeout(() => setSuccess(""), 3500);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error deactivating user");
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${username}"?`)) return;
    try {
      await adminService.deleteUser(id);
      setSuccess(`User ${username} deleted.`);
      setTimeout(() => setSuccess(""), 3500);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Review registrations, approve accounts, and designate Team Leaders</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters Toolbar */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 240px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              className="form-control"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="TEAM_LEADER">Team Leader</option>
              <option value="TEAM_MEMBER">Team Member</option>
            </select>
          </div>
          <div>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
          </div>
          <button className="btn btn-secondary" onClick={fetchUsers}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <div className="flex-center" style={{ padding: "3rem" }}>
            <div className="spinner"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            No users found matching the selected criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div>
                        <strong>{u.username}</strong>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{u.email}</div>
                        {u.deactivationReason && (
                          <div style={{ fontSize: "0.75rem", color: "var(--danger)" }}>
                            Reason: {u.deactivationReason}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <RoleBadge role={u.role} />
                    </td>
                    <td>
                      <StatusBadge status={u.status} />
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <div className="action-buttons" style={{ flexWrap: "wrap" }}>
                        {u.status === "PENDING" && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApprove(u.id)}
                              title="Approve registration"
                            >
                              ✓ Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(u.id)}
                              title="Reject registration"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}

                        {u.role === "TEAM_MEMBER" && u.status === "APPROVED" && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handlePromoteToLeader(u.id)}
                            title="Promote to Team Leader"
                          >
                            ⭐ Promote to TL
                          </button>
                        )}

                        {u.role === "TEAM_LEADER" && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleDemoteToMember(u.id)}
                            title="Demote to Team Member"
                          >
                            ⬇ Make Member
                          </button>
                        )}

                        {u.role !== "ADMIN" && u.status === "APPROVED" && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDeactivate(u.id)}
                            title="Deactivate account"
                          >
                            ⏸ Deactivate
                          </button>
                        )}

                        {u.role !== "ADMIN" && u.status === "DEACTIVATED" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(u.id)}
                            title="Re-activate account"
                          >
                            ▶ Reactivate
                          </button>
                        )}

                        {u.role !== "ADMIN" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(u.id, u.username)}
                            title="Permanently Delete User"
                          >
                            🗑
                          </button>
                        )}
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

export default ManageUsers;

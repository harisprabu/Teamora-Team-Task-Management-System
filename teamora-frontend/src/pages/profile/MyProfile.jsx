import React from "react";
import { useAuth } from "../../context/AuthContext";
import { RoleBadge } from "../../components/Badge";

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your personal account details and access credentials</p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: "1.5rem", alignItems: "flex-start" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Account Information</h3>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                className="user-avatar"
                style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", color: "var(--dark-teal)", margin: 0 }}>
                  {user?.username}
                </h2>
                <div style={{ marginTop: "0.25rem" }}>
                  <RoleBadge role={user?.role} />
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>User ID:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>#{user?.id}</div>
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Email Address:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>{user?.email}</div>
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Role:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>{user?.role?.replace("_", " ")}</div>
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Status:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem", color: "var(--success)" }}>Active / Approved</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Role Privileges & Permissions</h3>
          </div>
          <div className="card-body">
            {user?.role === "ADMIN" && (
              <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.8", color: "var(--text-main)" }}>
                <li>Full administrative system access</li>
                <li>Approve, reject, deactivate, or delete user registrations</li>
                <li>Promote Team Members to Team Leaders</li>
                <li>Create and configure engineering teams & squads</li>
                <li>Create projects and assign them to Team Leaders</li>
                <li>Monitor overall organization progress and metrics</li>
              </ul>
            )}

            {user?.role === "TEAM_LEADER" && (
              <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.8", color: "var(--text-main)" }}>
                <li>Assigned projects breakdown into granular tasks</li>
                <li>Delegate tasks exclusively to allocated squad members</li>
                <li>Set priority levels and milestones/deadlines</li>
                <li>Review and monitor daily feedback logs from squad</li>
                <li>Evaluate member performance with 1-5 star ratings</li>
                <li>Receive system activity notifications</li>
              </ul>
            )}

            {user?.role === "TEAM_MEMBER" && (
              <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.8", color: "var(--text-main)" }}>
                <li>View tasks assigned to you by your Team Leader</li>
                <li>Transition tasks from Assigned to In Progress to Completed</li>
                <li>Participate in collaborative task comment threads</li>
                <li>Submit daily work feedback and report technical blockers</li>
                <li>View your assigned squad and fellow teammates</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

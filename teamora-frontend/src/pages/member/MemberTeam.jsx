import React, { useState, useEffect } from "react";
import { memberService } from "../../services/memberService";

const MemberTeam = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await memberService.getMyTeam();
      setTeam(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team squad details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Team Squad</h1>
          <p className="page-subtitle">Your squad colleagues and designated Team Leader</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!team ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            You are not currently assigned to any team squad.
          </p>
          <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
            The Administrator assigns members to teams. Once assigned, your squad details will appear here.
          </span>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header">
              <h3 className="card-title" style={{ fontSize: "1.3rem", color: "var(--dark-teal)" }}>
                🏢 {team.teamName}
              </h3>
              <p className="card-subtitle">{team.description || "Active engineering squad."}</p>
            </div>
            <div className="card-body" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Designated Team Leader:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                  {team.teamLeaderName ? (
                    <span className="badge badge-leader">⭐ {team.teamLeaderName}</span>
                  ) : (
                    <span className="badge badge-neutral">Unassigned</span>
                  )}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Members:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>{team.memberCount || 0} Members</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Squad Colleagues</h3>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {team.members && team.members.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div className="user-avatar" style={{ width: "34px", height: "34px", fontSize: "0.85rem" }}>
                            {m.username.charAt(0).toUpperCase()}
                          </div>
                          <strong>{m.username}</strong>
                        </div>
                      </td>
                      <td>{m.email}</td>
                      <td>
                        <span className="badge badge-member">Team Member</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MemberTeam;

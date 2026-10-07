import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { teamLeaderService } from "../../services/teamLeaderService";

const MyTeam = () => {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const [teamData, membersData] = await Promise.all([
        teamLeaderService.getTeam(),
        teamLeaderService.getMembers()
      ]);
      setTeam(teamData);
      setMembers(membersData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team data");
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
          <h1 className="page-title">Assigned Team Squad</h1>
          <p className="page-subtitle">Team members allocated to your leadership by the Administrator</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!team ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
            You are not currently assigned as leader to any team.
          </p>
          <span style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
            The Administrator assigns teams and team members. Once assigned, your members will appear here.
          </span>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header">
              <h3 className="card-title" style={{ color: "var(--dark-teal)", fontSize: "1.3rem" }}>
                🏢 {team.teamName}
              </h3>
              <p className="card-subtitle">{team.description || "Active engineering squad."}</p>
            </div>
            <div className="card-body" style={{ display: "flex", gap: "2rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Team Size:</span>
                <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--primary)" }}>
                  {members.length} Members
                </div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Created Date:</span>
                <div style={{ fontWeight: 600, fontSize: "1rem" }}>
                  {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="card-title">Allocated Members</h3>
              <span className="badge badge-primary">{members.length} Active</span>
            </div>

            {members.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                No members currently allocated to this team squad.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Email</th>
                      <th>Joined Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div className="user-avatar" style={{ width: "36px", height: "36px", fontSize: "0.9rem" }}>
                              {m.username.charAt(0).toUpperCase()}
                            </div>
                            <strong>{m.username}</strong>
                          </div>
                        </td>
                        <td>{m.email}</td>
                        <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "-"}</td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/team-leader/tasks?assignTo=${m.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              Assign Task
                            </Link>
                            <Link
                              to={`/team-leader/performance?memberId=${m.id}`}
                              className="btn btn-outline btn-sm"
                            >
                              Rate Performance
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyTeam;

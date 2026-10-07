import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { teamService } from "../../services/teamService";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((t) =>
    t.teamName.toLowerCase().includes(search.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">Collaborate with your team members across projects</p>
        </div>
        <div className="header-actions">
          <Link to="/teams/create" className="btn btn-primary">
            + Create Team
          </Link>
        </div>
      </div>

      <div className="card filter-bar-card">
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Search teams by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: "40vh" }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredTeams.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🏢</div>
          <h3>No teams found</h3>
          <p className="text-muted">
            {search ? "No teams matched your search criteria." : "You are not part of any team yet. Create one to begin!"}
          </p>
          {!search && (
            <Link to="/teams/create" className="btn btn-primary mt-3">
              Create Your First Team
            </Link>
          )}
        </div>
      ) : (
        <div className="teams-grid">
          {filteredTeams.map((team) => (
            <div key={team.id} className="team-card card">
              <div className="team-card-header">
                <div className="team-badge-icon">🏢</div>
                <div className="team-header-text">
                  <h3 className="team-title">{team.teamName}</h3>
                  <span className="team-creator">Created by @{team.createdByUsername || "admin"}</span>
                </div>
              </div>
              <p className="team-description">
                {team.description || "No description provided for this team."}
              </p>
              <div className="team-card-footer">
                <span className="badge badge-neutral">👥 {team.memberCount} Members</span>
                <Link to={`/teams/${team.id}`} className="btn btn-secondary btn-sm">
                  View Team &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;

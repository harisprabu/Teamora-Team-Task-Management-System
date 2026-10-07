import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { teamService } from "../../services/teamService";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!teamName.trim()) {
      setError("Team name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const newTeam = await teamService.createTeam({
        teamName: teamName.trim(),
        description: description.trim()
      });
      navigate(`/teams/${newTeam.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container form-page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Team</h1>
          <p className="page-subtitle">Assemble a team to collaborate on tasks</p>
        </div>
        <Link to="/teams" className="btn btn-secondary">
          &larr; Back to Teams
        </Link>
      </div>

      <div className="card form-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teamName">Team Name *</label>
            <input
              id="teamName"
              type="text"
              className="form-control"
              placeholder="e.g. Design Studio, Backend Engineering"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              disabled={loading}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              placeholder="Describe the team's goals and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </button>
            <Link to="/teams" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;

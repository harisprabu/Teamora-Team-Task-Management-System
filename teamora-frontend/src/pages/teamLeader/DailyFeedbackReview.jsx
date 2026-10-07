import React, { useState, useEffect } from "react";
import { teamLeaderService } from "../../services/teamLeaderService";

const DailyFeedbackReview = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState("ALL");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await teamLeaderService.getFeedback();
      setFeedbacks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team feedback submissions");
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

  // Extract unique members for filtering
  const memberNames = Array.from(new Set(feedbacks.map((f) => f.memberName).filter(Boolean)));
  const filteredFeedbacks = feedbacks.filter(
    (f) => selectedMember === "ALL" || f.memberName === selectedMember
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Team Feedbacks</h1>
          <p className="page-subtitle">Review daily progress, blockers, and next steps submitted by your squad</p>
        </div>
        <button className="btn btn-secondary" onClick={loadFeedback}>
          ↻ Refresh Updates
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter toolbar */}
      {memberNames.length > 0 && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Filter by Member:</label>
            <select
              className="form-control"
              style={{ maxWidth: "260px" }}
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="ALL">All Squad Members</option>
              {memberNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredFeedbacks.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            No daily feedback entries submitted yet by team members.
          </p>
          <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
            When members complete work and submit their daily log, their entries will show up here.
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {filteredFeedbacks.map((f) => (
            <div className="card" key={f.id}>
              <div
                className="card-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "0.75rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className="user-avatar" style={{ width: "38px", height: "38px", fontSize: "0.95rem" }}>
                    {f.memberName ? f.memberName.charAt(0).toUpperCase() : "M"}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--dark-teal)" }}>
                      {f.memberName}
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Date: {f.date ? new Date(f.date).toLocaleDateString() : "Today"}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                    Reported Progress
                  </span>
                  <strong style={{ fontSize: "1.1rem", color: "var(--primary)" }}>
                    {f.progress != null ? `${f.progress}%` : "N/A"}
                  </strong>
                </div>
              </div>

              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <h4 style={{ fontSize: "0.9rem", color: "var(--slate-teal)", marginBottom: "0.25rem" }}>
                    ✅ Work Completed Today:
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.5", whiteSpace: "pre-line" }}>
                    {f.workCompleted}
                  </p>
                </div>

                {f.issues && (
                  <div
                    style={{
                      background: "var(--danger-light)",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      borderLeft: "4px solid var(--danger)"
                    }}
                  >
                    <h4 style={{ fontSize: "0.85rem", color: "var(--danger)", margin: "0 0 0.25rem 0" }}>
                      ⚠️ Blockers / Issues Encountered:
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#8f2b27" }}>{f.issues}</p>
                  </div>
                )}

                {f.nextPlan && (
                  <div>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--ocean-teal)", marginBottom: "0.25rem" }}>
                      🎯 Next Steps / Plan for Tomorrow:
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", whiteSpace: "pre-line" }}>
                      {f.nextPlan}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyFeedbackReview;

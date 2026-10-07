import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { teamLeaderService } from "../../services/teamLeaderService";

const MemberPerformance = () => {
  const [searchParams] = useSearchParams();
  const preselectedMemberId = searchParams.get("memberId");

  const [members, setMembers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [ratingData, setRatingData] = useState({
    memberId: preselectedMemberId || "",
    rating: 5,
    feedback: ""
  });

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (ratingData.memberId) {
      loadHistory(ratingData.memberId);
    }
  }, [ratingData.memberId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await teamLeaderService.getMembers();
      setMembers(data);
      if (preselectedMemberId) {
        setRatingData((prev) => ({ ...prev, memberId: preselectedMemberId }));
      } else if (data.length > 0) {
        setRatingData((prev) => ({ ...prev, memberId: String(data[0].id) }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (memberId) => {
    try {
      const data = await teamLeaderService.getMemberPerformance(memberId);
      setHistory(data);
    } catch (err) {
      setHistory([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ratingData.memberId) {
      setError("Please select a team member");
      return;
    }

    try {
      await teamLeaderService.rateMember({
        memberId: Number(ratingData.memberId),
        rating: Number(ratingData.rating),
        feedback: ratingData.feedback
      });
      setSuccess("Performance rating submitted successfully!");
      setTimeout(() => setSuccess(""), 4000);
      setRatingData((prev) => ({ ...prev, feedback: "" }));
      loadHistory(ratingData.memberId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit rating");
    }
  };

  const activeMember = members.find((m) => String(m.id) === String(ratingData.memberId));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Member Performance Evaluation</h1>
          <p className="page-subtitle">Provide structured ratings (1-5 stars) and qualitative feedback to team members</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {members.length === 0 && !loading ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)" }}>
            No members are currently allocated to your squad. Contact the Admin to assign members.
          </p>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: "1.5rem", alignItems: "flex-start" }}>
          {/* Rating Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Submit Performance Review</h3>
              <p className="card-subtitle">Assess output quality, responsiveness, and task delivery</p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
              <div className="form-group">
                <label>Select Team Member *</label>
                <select
                  className="form-control"
                  value={ratingData.memberId}
                  onChange={(e) => setRatingData({ ...ratingData, memberId: e.target.value })}
                  required
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.username} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Performance Rating (1 to 5 Stars) *</label>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingData({ ...ratingData, rating: star })}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "1.2rem",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        background: ratingData.rating >= star ? "#FDF4DD" : "#F7FAFE",
                        color: ratingData.rating >= star ? "#8a6f1c" : "var(--text-muted)",
                        cursor: "pointer"
                      }}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Feedback & Guidance Notes</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Mention strengths, achievements, areas for improvement, or constructive guidance..."
                  value={ratingData.feedback}
                  onChange={(e) => setRatingData({ ...ratingData, feedback: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                ⭐ Save Performance Evaluation
              </button>
            </form>
          </div>

          {/* Historical Ratings for Selected Member */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Review History: {activeMember?.username || "Selected Member"}
              </h3>
              <p className="card-subtitle">Past evaluations given to this member</p>
            </div>

            <div style={{ padding: "1.25rem" }}>
              {history.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "2rem 0" }}>
                  No previous performance evaluations recorded for this member.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {history.map((h) => (
                    <div
                      key={h.id}
                      style={{
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        padding: "1rem",
                        background: "#F7FAFE"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ color: "#c9962b", fontWeight: 700, fontSize: "1.05rem" }}>
                          {"★".repeat(h.rating)}{"☆".repeat(5 - h.rating)} ({h.rating}/5)
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {h.date ? new Date(h.date).toLocaleDateString() : "-"}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-main)", lineHeight: "1.5" }}>
                        "{h.feedback}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPerformance;

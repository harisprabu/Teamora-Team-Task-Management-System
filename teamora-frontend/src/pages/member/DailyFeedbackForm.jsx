import React, { useState, useEffect } from "react";
import { memberService } from "../../services/memberService";

const DailyFeedbackForm = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    workCompleted: "",
    progress: 50,
    issues: "",
    nextPlan: ""
  });

  useEffect(() => {
    loadFeedbackHistory();
  }, []);

  const loadFeedbackHistory = async () => {
    try {
      setLoading(true);
      const data = await memberService.getFeedbackHistory();
      setHistory(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load daily feedback history");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.workCompleted.trim()) {
      setError("Please describe the work completed today");
      return;
    }

    try {
      setSubmitting(true);
      await memberService.submitFeedback({
        date: formData.date,
        workCompleted: formData.workCompleted.trim(),
        progress: Number(formData.progress),
        issues: formData.issues.trim() || null,
        nextPlan: formData.nextPlan.trim() || null
      });

      setSuccess("Daily feedback log submitted! Your Team Leader will review it.");
      setTimeout(() => setSuccess(""), 4000);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        workCompleted: "",
        progress: 50,
        issues: "",
        nextPlan: ""
      });
      loadFeedbackHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit daily feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Work Log & Feedback</h1>
          <p className="page-subtitle">Submit your daily work report and blockers directly to your Team Leader</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid-2" style={{ gap: "1.5rem", alignItems: "flex-start" }}>
        {/* Daily Report Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Submit Today's Work Report</h3>
            <p className="card-subtitle">Keep your Team Leader updated on your day's achievements</p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
            <div className="grid-2" style={{ gap: "1rem" }}>
              <div className="form-group">
                <label>Report Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Progress: {formData.progress}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="form-control"
                  style={{ padding: 0 }}
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Work Completed Today *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Detail what features, modules, or tasks you worked on and accomplished today..."
                value={formData.workCompleted}
                onChange={(e) => setFormData({ ...formData, workCompleted: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Blockers / Issues Encountered (Optional)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Any technical hurdles, missing requirements, or dependencies blocking you..."
                value={formData.issues}
                onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Plan for Tomorrow</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="What tasks or objectives do you plan to tackle next..."
                value={formData.nextPlan}
                onChange={(e) => setFormData({ ...formData, nextPlan: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Submitting..." : "📤 Submit Daily Log"}
            </button>
          </form>
        </div>

        {/* History of Past Reports */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Past Submissions History ({history.length})</h3>
            <p className="card-subtitle">Your previous daily logs submitted to your Team Leader</p>
          </div>

          <div style={{ padding: "1.25rem", maxHeight: "580px", overflowY: "auto" }}>
            {loading ? (
              <div className="flex-center" style={{ padding: "2rem" }}>
                <div className="spinner"></div>
              </div>
            ) : history.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
                No feedback logs submitted yet. Fill out the form to create your first report.
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
                      <strong style={{ color: "var(--dark-teal)" }}>
                        📅 {h.date ? new Date(h.date).toLocaleDateString() : "-"}
                      </strong>
                      <span className="badge badge-primary">Progress: {h.progress ?? 0}%</span>
                    </div>

                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", lineHeight: "1.5", whiteSpace: "pre-line" }}>
                      {h.workCompleted}
                    </p>

                    {h.issues && (
                      <div style={{ fontSize: "0.85rem", color: "#8f2b27", background: "var(--danger-light)", padding: "0.4rem 0.6rem", borderRadius: "var(--radius-sm)", marginBottom: "0.4rem" }}>
                        <strong>⚠️ Issues:</strong> {h.issues}
                      </div>
                    )}

                    {h.nextPlan && (
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        <strong>🎯 Next:</strong> {h.nextPlan}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyFeedbackForm;

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { memberService } from "../../services/memberService";
import { PriorityBadge, StatusBadge } from "../../components/Badge";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    loadTaskAndComments();
  }, [id]);

  const loadTaskAndComments = async () => {
    try {
      setLoading(true);
      const [taskData, commentsData] = await Promise.all([
        memberService.getTaskById(id),
        memberService.getComments(id)
      ]);
      setTask(taskData);
      setComments(commentsData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async () => {
    try {
      await memberService.startTask(task.id);
      setSuccess("Task status updated to In Progress!");
      setTimeout(() => setSuccess(""), 3500);
      loadTaskAndComments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start task");
    }
  };

  const handleCompleteTask = async () => {
    try {
      await memberService.completeTask(task.id);
      setSuccess("Task marked as Completed!");
      setTimeout(() => setSuccess(""), 3500);
      loadTaskAndComments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete task");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommenting(true);
      await memberService.addComment(task.id, newComment.trim());
      setNewComment("");
      const updatedComments = await memberService.getComments(task.id);
      setComments(updatedComments);
      setSuccess("Comment posted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error}</div>
        <Link to="/member/tasks" className="btn btn-secondary">
          ← Back to My Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link to="/member/tasks" style={{ fontSize: "0.85rem", color: "var(--primary)" }}>
            ← Back to My Tasks
          </Link>
          <h1 className="page-title" style={{ marginTop: "0.4rem" }}>
            {task.title}
          </h1>
          <p className="page-subtitle">Project: {task.projectName}</p>
        </div>
        <div className="header-actions">
          {task.status === "ASSIGNED" && (
            <button className="btn btn-primary" onClick={handleStartTask}>
              ▶ Start Task
            </button>
          )}
          {task.status === "IN_PROGRESS" && (
            <button className="btn btn-success" onClick={handleCompleteTask}>
              ✓ Mark Completed
            </button>
          )}
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid-2" style={{ gap: "1.5rem", alignItems: "flex-start" }}>
        {/* Task Details Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Specifications</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>

          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Description:</span>
              <p style={{ marginTop: "0.25rem", fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                {task.description || "No specific instructions provided."}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Target Deadline:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Deadline"}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Assigned By:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                  {task.createdByName || "Team Leader"}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Created At:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                  {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Last Updated:</span>
                <div style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                  {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Comments Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">💬 Collaboration & Comments ({comments.length})</h3>
            <p className="card-subtitle">Communicate with your Team Leader regarding this task</p>
          </div>

          <div className="card-body">
            {/* Comments List */}
            <div style={{ maxHeight: "350px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem", paddingRight: "0.5rem" }}>
              {comments.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "1.5rem 0" }}>
                  No comments yet on this task. Post an update or ask a question below.
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.85rem",
                      background: "#F7FAFE"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <strong>@{c.userName}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.4", whiteSpace: "pre-line" }}>
                      {c.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Type an update or comment for your Team Leader..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={commenting}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={commenting || !newComment.trim()}
              >
                {commenting ? "Posting..." : "💬 Add Comment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

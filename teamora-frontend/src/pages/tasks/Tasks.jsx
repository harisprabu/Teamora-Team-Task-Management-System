import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { taskService } from "../../services/taskService";
import { teamService } from "../../services/teamService";
import { userService } from "../../services/userService";
import { StatusBadge, PriorityBadge } from "../../components/Badge";
import Modal from "../../components/Modal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState({ text: "", type: "" });

  // Filters & Search & Sort
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("dueDateAsc");

  // Delete Modal state
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteTaskTitle, setDeleteTaskTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, teamsData, usersData] = await Promise.all([
        taskService.getAllTasks(),
        teamService.getAllTeams(),
        userService.getAllUsers().catch(() => [])
      ]);
      setTasks(tasksData);
      setTeams(teamsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await taskService.updateStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setActionMsg({ text: "Task status updated!", type: "success" });
      setTimeout(() => setActionMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      setActionMsg({
        text: err.response?.data?.message || "Failed to update status",
        type: "danger"
      });
    }
  };

  const confirmDelete = (task) => {
    setDeleteTaskId(task.id);
    setDeleteTaskTitle(task.title);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTaskId) return;
    try {
      setDeleting(true);
      await taskService.deleteTask(deleteTaskId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
      setActionMsg({ text: "Task deleted successfully", type: "success" });
      setIsDeleteModalOpen(false);
    } catch (err) {
      setActionMsg({
        text: err.response?.data?.message || "Failed to delete task",
        type: "danger"
      });
      setIsDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Sort Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
    const matchesTeam = teamFilter === "ALL" || String(task.teamId) === teamFilter;
    const matchesAssignee = assigneeFilter === "ALL" || String(task.assignedToId) === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesTeam && matchesAssignee;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDateAsc") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "dueDateDesc") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (sortBy === "createdDesc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Track, filter, and organize team task workflows</p>
        </div>
        <div className="header-actions">
          <Link to="/tasks/create" className="btn btn-primary">
            + Create Task
          </Link>
        </div>
      </div>

      {actionMsg.text && (
        <div className={`alert alert-${actionMsg.type} mb-4`}>{actionMsg.text}</div>
      )}

      {/* Search and Filters Bar */}
      <div className="card filter-bar-card mb-4">
        <div className="filters-grid">
          <div className="filter-item search-filter">
            <label>Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Priority</label>
            <select
              className="form-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Team</label>
            <select
              className="form-control"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              <option value="ALL">All Teams</option>
              {teams.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.teamName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Assignee</label>
            <select
              className="form-control"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            >
              <option value="ALL">All Assignees</option>
              {users.map((u) => (
                <option key={u.id} value={String(u.id)}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Sort By</label>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDateAsc">Deadline (Soonest First)</option>
              <option value="dueDateDesc">Deadline (Latest First)</option>
              <option value="createdDesc">Created Date (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: "40vh" }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : sortedTasks.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p className="text-muted">
            {search || statusFilter !== "ALL" || priorityFilter !== "ALL"
              ? "No tasks match your selected filter criteria."
              : "No tasks have been created yet. Create one now!"}
          </p>
          <Link to="/tasks/create" className="btn btn-primary mt-3">
            + Create New Task
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Team</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div>
                        <Link to={`/tasks/${task.id}`} className="table-link font-semibold">
                          {task.title}
                        </Link>
                        {task.description && (
                          <p className="task-table-desc text-muted">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <Link to={`/teams/${task.teamId}`} className="text-sm">
                        {task.teamName}
                      </Link>
                    </td>
                    <td>
                      {task.assignedToName ? (
                        <span className="user-pill">@{task.assignedToName}</span>
                      ) : (
                        <span className="text-muted text-xs">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td>
                      <select
                        className="status-dropdown"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td>
                      <span className="text-sm">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                      </span>
                    </td>
                    <td>
                      <div className="table-action-btns">
                        <Link to={`/tasks/${task.id}`} className="btn btn-outline btn-xs" title="View Details">
                          View
                        </Link>
                        <Link to={`/tasks/edit/${task.id}`} className="btn btn-secondary btn-xs" title="Edit">
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger-outline btn-xs"
                          onClick={() => confirmDelete(task)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Task Deletion"
      >
        <p className="mb-4">
          Are you sure you want to delete task <strong>"{deleteTaskTitle}"</strong>? This action cannot be reversed.
        </p>
        <div className="form-actions">
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Task"}
          </button>
          <button className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Tasks;

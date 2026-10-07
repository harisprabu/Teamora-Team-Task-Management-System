import API from "./api";

export const teamLeaderService = {
  getProjects: async () => {
    const res = await API.get("/team-leader/projects");
    return res.data;
  },

  getTeam: async () => {
    const res = await API.get("/team-leader/team");
    return res.data;
  },

  getMembers: async () => {
    const res = await API.get("/team-leader/members");
    return res.data;
  },

  getTasks: async () => {
    const res = await API.get("/team-leader/tasks");
    return res.data;
  },

  createTask: async (taskData) => {
    const res = await API.post("/team-leader/tasks", taskData);
    return res.data;
  },

  updateTask: async (taskId, taskData) => {
    const res = await API.put(`/team-leader/tasks/${taskId}`, taskData);
    return res.data;
  },

  assignTask: async (taskId, memberId) => {
    const res = await API.put(`/team-leader/tasks/${taskId}/assign/${memberId}`);
    return res.data;
  },

  deleteTask: async (taskId) => {
    const res = await API.delete(`/team-leader/tasks/${taskId}`);
    return res.data;
  },

  getTeamProgress: async () => {
    const res = await API.get("/team-leader/progress");
    return res.data;
  },

  getFeedback: async () => {
    const res = await API.get("/team-leader/feedback");
    return res.data;
  },

  rateMember: async (ratingData) => {
    const res = await API.post("/team-leader/performance", ratingData);
    return res.data;
  },

  getMemberPerformance: async (memberId) => {
    const res = await API.get(`/team-leader/performance/${memberId}`);
    return res.data;
  }
};

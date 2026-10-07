import API from "./api";

export const memberService = {
  getDashboard: async () => {
    const res = await API.get("/member/dashboard");
    return res.data;
  },

  getMyTasks: async () => {
    const res = await API.get("/member/tasks");
    return res.data;
  },

  getTaskById: async (taskId) => {
    const res = await API.get(`/member/tasks/${taskId}`);
    return res.data;
  },

  startTask: async (taskId) => {
    const res = await API.put(`/member/tasks/${taskId}/start`);
    return res.data;
  },

  completeTask: async (taskId) => {
    const res = await API.put(`/member/tasks/${taskId}/complete`);
    return res.data;
  },

  updateStatus: async (taskId, status) => {
    const res = await API.put(`/member/tasks/${taskId}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  getComments: async (taskId) => {
    const res = await API.get(`/member/tasks/${taskId}/comments`);
    return res.data;
  },

  addComment: async (taskId, comment) => {
    const res = await API.post(`/member/tasks/${taskId}/comments`, { comment });
    return res.data;
  },

  submitFeedback: async (feedbackData) => {
    const res = await API.post("/member/daily-feedback", feedbackData);
    return res.data;
  },

  getFeedbackHistory: async () => {
    const res = await API.get("/member/daily-feedback");
    return res.data;
  },

  getMyTeam: async () => {
    const res = await API.get("/member/team");
    return res.data;
  },

  getMyPerformance: async () => {
    const res = await API.get("/member/performance");
    return res.data;
  }
};

import API from "./api";

export const dashboardService = {
  getStats: async () => {
    const res = await API.get("/dashboard/stats");
    return res.data;
  },

  getAdminOverview: async () => {
    const res = await API.get("/admin/dashboard");
    return res.data;
  },

  getAdminUsers: async () => {
    const res = await API.get("/admin/users");
    return res.data;
  },

  getAdminTeams: async () => {
    const res = await API.get("/admin/teams");
    return res.data;
  },

  getAdminTasks: async () => {
    const res = await API.get("/admin/tasks");
    return res.data;
  }
};

import API from "./api";

export const adminService = {
  getDashboard: async () => {
    const res = await API.get("/admin/dashboard");
    return res.data;
  },

  getUsers: async () => {
    const res = await API.get("/admin/users");
    return res.data;
  },

  approveUser: async (userId) => {
    const res = await API.put(`/admin/users/${userId}/approve`);
    return res.data;
  },

  rejectUser: async (userId) => {
    const res = await API.put(`/admin/users/${userId}/reject`);
    return res.data;
  },

  deactivateUser: async (userId, reason) => {
    const res = await API.put(`/admin/users/${userId}/deactivate`, null, {
      params: { reason }
    });
    return res.data;
  },

  updateUserRole: async (userId, role) => {
    const res = await API.put(`/admin/users/${userId}/role`, null, {
      params: { role }
    });
    return res.data;
  },

  deleteUser: async (userId) => {
    const res = await API.delete(`/admin/users/${userId}`);
    return res.data;
  },

  getTeams: async () => {
    const res = await API.get("/admin/teams");
    return res.data;
  },

  createTeam: async (teamData) => {
    const res = await API.post("/admin/teams", teamData);
    return res.data;
  },

  updateTeam: async (teamId, teamData) => {
    const res = await API.put(`/admin/teams/${teamId}`, teamData);
    return res.data;
  },

  deleteTeam: async (teamId) => {
    const res = await API.delete(`/admin/teams/${teamId}`);
    return res.data;
  },

  addMemberToTeam: async (teamId, userId) => {
    const res = await API.post(`/admin/teams/${teamId}/members/${userId}`);
    return res.data;
  },

  removeMemberFromTeam: async (teamId, userId) => {
    const res = await API.delete(`/admin/teams/${teamId}/members/${userId}`);
    return res.data;
  },

  getProjects: async () => {
    const res = await API.get("/admin/projects");
    return res.data;
  },

  createProject: async (projectData) => {
    const res = await API.post("/admin/projects", projectData);
    return res.data;
  },

  updateProject: async (projectId, projectData) => {
    const res = await API.put(`/admin/projects/${projectId}`, projectData);
    return res.data;
  },

  assignProjectToLeader: async (projectId, leaderId) => {
    const res = await API.put(`/admin/projects/${projectId}/assign/${leaderId}`);
    return res.data;
  },

  deleteProject: async (projectId) => {
    const res = await API.delete(`/admin/projects/${projectId}`);
    return res.data;
  }
};

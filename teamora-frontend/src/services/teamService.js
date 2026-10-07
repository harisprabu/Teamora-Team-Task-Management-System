import API from "./api";

export const teamService = {
  getAllTeams: async () => {
    const res = await API.get("/teams");
    return res.data;
  },

  getTeamById: async (id) => {
    const res = await API.get(`/teams/${id}`);
    return res.data;
  },

  createTeam: async (teamData) => {
    const res = await API.post("/teams", teamData);
    return res.data;
  },

  updateTeam: async (id, teamData) => {
    const res = await API.put(`/teams/${id}`, teamData);
    return res.data;
  },

  deleteTeam: async (id) => {
    const res = await API.delete(`/teams/${id}`);
    return res.data;
  },

  getTeamMembers: async (teamId) => {
    const res = await API.get(`/teams/${teamId}/members`);
    return res.data;
  },

  addMember: async (teamId, memberData) => {
    const res = await API.post(`/teams/${teamId}/members`, memberData);
    return res.data;
  },

  removeMember: async (teamId, userId) => {
    const res = await API.delete(`/teams/${teamId}/members/${userId}`);
    return res.data;
  }
};

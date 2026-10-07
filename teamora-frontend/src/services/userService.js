import API from "./api";

export const userService = {
  getAllUsers: async () => {
    const res = await API.get("/users");
    return res.data;
  },

  getUserById: async (id) => {
    const res = await API.get(`/users/${id}`);
    return res.data;
  },

  getProfile: async () => {
    const res = await API.get("/users/me");
    return res.data;
  },

  updateUser: async (id, userData) => {
    const res = await API.put(`/users/${id}`, userData);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await API.delete(`/users/${id}`);
    return res.data;
  }
};

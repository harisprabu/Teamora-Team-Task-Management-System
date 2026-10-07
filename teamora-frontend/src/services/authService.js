import API from "./api";

export const authService = {
  login: async (username, password) => {
    const res = await API.post("/auth/login", { username, password });
    return res.data;
  },

  register: async (userData) => {
    const res = await API.post("/auth/register", userData);
    return res.data;
  }
};

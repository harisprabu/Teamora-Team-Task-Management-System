import API from "./api";

export const taskService = {
  getAllTasks: async () => {
    const res = await API.get("/tasks");
    return res.data;
  },

  getTaskById: async (id) => {
    const res = await API.get(`/tasks/${id}`);
    return res.data;
  },

  getMyTasks: async () => {
    const res = await API.get("/tasks/my-tasks");
    return res.data;
  },

  getTasksByTeam: async (teamId) => {
    const res = await API.get(`/tasks/team/${teamId}`);
    return res.data;
  },

  createTask: async (taskData) => {
    const res = await API.post("/tasks", taskData);
    return res.data;
  },

  updateTask: async (id, taskData) => {
    const res = await API.put(`/tasks/${id}`, taskData);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await API.put(`/tasks/${id}/status`, { status });
    return res.data;
  },

  deleteTask: async (id) => {
    const res = await API.delete(`/tasks/${id}`);
    return res.data;
  }
};

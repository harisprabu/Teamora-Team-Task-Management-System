import API from "./api";

export const notificationService = {
  getNotifications: async () => {
    const res = await API.get("/notifications");
    return res.data;
  },

  getUnreadCount: async () => {
    const res = await API.get("/notifications/unread-count");
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await API.put(`/notifications/${id}/read`);
    return res.data;
  }
};

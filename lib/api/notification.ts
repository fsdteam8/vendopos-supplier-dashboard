import api from "./api";



// Get All Notifications
export const getAllNotifications = async (id: string) => {
  try {
    const response = await api.get(`/notification/supplier/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark notification as viewed
export const markNotificationAsViewed = async () => {
  try {
    const response = await api.patch(`/notification/read/all`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as viewed:", error);
    throw error;
  }
};

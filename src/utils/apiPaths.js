export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "api/auth/profileUpdate",
  },

  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
    CREATE_USER: "/api/users",
    UPDATE_USER: (userId) => `/api/users/${userId}`,
    DELETE_USER: (userId) => `/api/users/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks",
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`,
  },

  COMMENTS: {
    GET_COMMENTS_BY_TASK: (taskId) => `/api/comments/${taskId}/comments`,
    ADD_COMMENT: (taskId) => `/api/comments/${taskId}/comments`,
    EDIT_COMMENT: (taskId, commentId) =>
      `/api/comments/${taskId}/comments/${commentId}`,
    DELETE_COMMENT: (taskId, commentId) =>
      `/api/comments/${taskId}/comments/${commentId}`,
    ADD_REACTION: (taskId, commentId) =>
      `/api/comments/${taskId}/comments/${commentId}/reactions`,
    DELETE_ALL_COMMENTS: (taskId) => `/api/comments/${taskId}/comments`,

    // Updated attachment routes (task attachments, no commentId)
    // ADD_ATTACHMENT: (taskId) => `/api/tasks/${taskId}/attachments`,
    // UPDATE_ATTACHMENT: (taskId, attachmentId) => `/api/tasks/${taskId}/attachments/${attachmentId}`,
    // DELETE_ATTACHMENT: (taskId, attachmentId) => `/api/tasks/${taskId}/attachments/${attachmentId}`,
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};

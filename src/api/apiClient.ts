import axios from "axios";

// Standard API endpoint configuration matching our Spring Boot server
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout for complex AI requests
});

// Request interceptor to inject JWT bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    // Prevent request if browser is offline
    if (!navigator.onLine) {
      return Promise.reject(new Error("No internet connection detected. Please verify your network."));
    }
    const token = localStorage.getItem("focusflow_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration (401) and format errors gracefully
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Session Expiration Handling
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");
      localStorage.removeItem("focusflow_user");
      localStorage.removeItem("focusflow_token");
      
      // If we are not already on the login page, reload to trigger redirect to login
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        window.location.href = "/login?expired=true";
      }
      return Promise.reject(new Error("Your session has expired. Please sign in again."));
    }

    // 2. Network / Offline Error Handling
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return Promise.reject(new Error("The connection timed out. Our servers might be busy. Please try again."));
    }

    if (!error.response) {
      return Promise.reject(new Error("Cannot connect to FocusFlow servers. Please check if you are offline."));
    }

    // 3. Backend-thrown API errors with standard ApiResponse structure
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      return Promise.reject(new Error(serverMessage));
    }

    return Promise.reject(error);
  }
);

export default apiClient;

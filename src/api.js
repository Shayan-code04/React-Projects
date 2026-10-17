
import axios from "axios";

const api = axios.create({
  baseURL: "https://job-tracker-api-tk84.onrender.com",
});

// STEP 1: Attach the token to outgoing requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// STEP 2: Handle incoming responses.
api.interceptors.response.use(
  (response) => {
    // Successful response: let the request continue.
    return response;
  },
  (error) => {
    // Check whether FastAPI returned 401 Unauthorized.
    if (error.response?.status === 401) {
      // Remove saved authentication information.
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");

      // Redirect to login if not already there.
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    // Pass the error back to the component that made the request.
    return Promise.reject(error);
  }
);

export default api;

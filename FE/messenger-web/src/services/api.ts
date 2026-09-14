import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const nonAuthApi = axios.create({
  baseURL: API_BASE_URL,
});

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/users/refresh`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        const newAccessToken = response.data?.token;
        if (!newAccessToken) {
          throw new Error("Refresh response has no access token");
        }

        if (typeof window !== "undefined") {
          sessionStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("token", newAccessToken);
        }
        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token =
      sessionStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest =
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/auth/google") ||
      requestUrl.includes("/users/refresh");

    if (
      error.response?.status === 401 &&
      !isAuthRequest &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (err) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("accessToken");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

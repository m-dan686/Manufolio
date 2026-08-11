import axios from "axios";

/**
 * Centralized Axios instance.
 * baseURL is driven by the VITE_API_BASE_URL environment variable so
 * switching between local / staging / production requires only a .env change.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000, // 15 second timeout
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
// Attach JWT access token ONLY for /admin endpoints so public requests (e.g. /contact/submit)
// are never rejected due to stale/expired tokens in localStorage.
api.interceptors.request.use(
    (config) => {
        if (config.url && config.url.includes("/admin")) {
            const token = localStorage.getItem("adminToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // Prevent infinite loop if the refresh request itself fails
        if (originalRequest.url && originalRequest.url.includes("/auth/refresh")) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminRefreshToken");
            if (window.location.pathname.startsWith("/admin") && !window.location.search.includes("expired=true")) {
                window.location.href = "/admin?expired=true";
            }
            return Promise.reject(error);
        }

        // Only redirect to /admin on 401 if the request was targeting an /admin endpoint!
        if (status === 401 && originalRequest.url && originalRequest.url.includes("/admin") && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("adminRefreshToken");
            if (!refreshToken) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminRefreshToken");
                if (window.location.pathname.startsWith("/admin") && !window.location.search.includes("expired=true")) {
                    window.location.href = "/admin?expired=true";
                }
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api") + "/auth/refresh",
                    { refreshToken }
                );

                const { token, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem("adminToken", token);
                if (newRefreshToken) {
                    localStorage.setItem("adminRefreshToken", newRefreshToken);
                }

                originalRequest.headers.Authorization = `Bearer ${token}`;
                processQueue(null, token);
                isRefreshing = false;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminRefreshToken");
                if (window.location.pathname.startsWith("/admin") && !window.location.search.includes("expired=true")) {
                    window.location.href = "/admin?expired=true";
                }
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

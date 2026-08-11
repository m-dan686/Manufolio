import api from "../axios";

/**
 * Authentication service.
 * Handles admin login and token refresh against the Spring Boot backend.
 */

/**
 * Login with username and password.
 * On success, stores access + refresh tokens in localStorage.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string, refreshToken: string, username: string }>}
 */
export const login = async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    const { token, refreshToken } = response.data.data;
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminRefreshToken", refreshToken);
    return response.data.data;
};

/**
 * Exchange a refresh token for a new access token.
 * @returns {Promise<string>} new access token
 */
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("adminRefreshToken");
    if (!refreshToken) throw new Error("No refresh token available");
    const response = await api.post("/auth/refresh", { refreshToken });
    const { token } = response.data.data;
    localStorage.setItem("adminToken", token);
    return token;
};

/**
 * Clear tokens and log out.
 */
export const logout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (e) {
        console.error("Failed to notify backend on logout:", e);
    } finally {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
    }
};

/**
 * Check if an admin token currently exists in localStorage.
 * @returns {boolean}
 */
export const isAuthenticated = () =>
    Boolean(localStorage.getItem("adminToken"));

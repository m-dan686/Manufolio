import api from "../axios";

/**
 * Health check service for backend cold-start wake-up.
 * Performs a lightweight GET /api/health request with a short timeout.
 */
export const pingHealth = async () => {
    try {
        const response = await api.get("/health", { timeout: 5000 });
        return response.data;
    } catch (error) {
        // Silently swallow or debug log so rendering/UI is never impacted
        if (import.meta.env.DEV) {
            console.debug("[HEALTH] Backend wake-up ping attempted:", error.message);
        }
        return null;
    }
};

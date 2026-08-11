import api from "../axios";

/**
 * Admin service.
 * All endpoints require a valid JWT (auto-attached by the Axios interceptor).
 */

/**
 * Fetch dashboard analytics.
 * @returns {Promise<{ totalMessages, unreadMessages, todayMessages, thisWeekMessages, thisMonthMessages }>}
 */
export const getStats = () =>
    api.get("/admin/stats").then((res) => res.data.data);

/**
 * Fetch paginated, searchable, sortable contact messages.
 *
 * @param {{ page?: number, size?: number, sort?: string, search?: string }} params
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const getMessages = ({ page = 0, size = 10, sort = "sentAt,desc", search = "" } = {}) =>
    api.get("/admin/messages", { params: { page, size, sort, search } }).then((res) => res.data.data);

/**
 * Mark a single message as read.
 * @param {number} id
 */
export const markAsRead = (id) =>
    api.patch(`/admin/messages/${id}/read`).then((res) => res.data);

/**
 * Mark all messages as read.
 */
export const markAllAsRead = () =>
    api.patch("/admin/messages/read-all").then((res) => res.data);

/**
 * Delete a contact message.
 * @param {number} id
 */
export const deleteMessage = (id) =>
    api.delete(`/admin/messages/${id}`).then((res) => res.data);

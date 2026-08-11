import api from "../axios";

/**
 * Contact form service.
 * Submits a visitor's contact message to the Spring Boot backend.
 */

/**
 * @param {{ name: string, email: string, phone: string, message: string }} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const submitContact = (data) =>
    api.post("/contact/submit", data);

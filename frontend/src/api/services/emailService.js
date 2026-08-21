import emailjs from "@emailjs/browser";

/**
 * Service for sending visitor contact email notifications using EmailJS.
 * Operates purely in the browser with public configuration keys.
 */

/**
 * Sends contact notification email via EmailJS.
 *
 * @param {{ name: string, email: string, subject?: string, message: string, phone?: string }} contactData
 * @returns {Promise<{ success: boolean, status: string, error?: string }>}
 */
export const sendContactEmail = async (contactData) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Check if EmailJS environment configuration is present
  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      "[EMAILJS] Notification SKIPPED: Environment variables (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) are missing or incomplete."
    );
    return {
      success: false,
      status: "UNCONFIGURED",
      error: "Email service is not configured. Please set EmailJS environment variables."
    };
  }

  const templateParams = {
    from_name: contactData.name ? contactData.name.trim() : "",
    from_email: contactData.email ? contactData.email.trim() : "",
    subject: contactData.subject ? contactData.subject.trim() : "General Inquiry",
    message: contactData.message ? contactData.message.trim() : ""
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

    console.info("[EMAILJS] Contact notification email sent successfully", response);
    return {
      success: true,
      status: "SENT",
      response
    };
  } catch (error) {
    const errorMessage = error?.text || error?.message || String(error);
    console.error("[EMAILJS] Failed to send contact notification email:", error);
    return {
      success: false,
      status: "EMAIL_SEND_FAILED",
      error: "Unable to send your message right now. Please try again."
    };
  }
};


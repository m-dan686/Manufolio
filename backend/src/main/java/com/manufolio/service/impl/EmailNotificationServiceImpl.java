package com.manufolio.service.impl;

import com.manufolio.entity.Contact;
import com.manufolio.enums.NotificationStatus;
import com.manufolio.repository.ContactRepository;
import com.manufolio.service.EmailNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Implementation of EmailNotificationService.
 * Delivers transactional contact emails asynchronously via Brevo HTTPS REST API (Port 443).
 * Guaranteed to isolate failures so Contact submission never fails or rolls back.
 */
@Slf4j
@Service
public class EmailNotificationServiceImpl implements EmailNotificationService {

    private final ContactRepository contactRepository;
    private final RestTemplate restTemplate;

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.api.url:https://api.brevo.com/v3/smtp/email}")
    private String brevoApiUrl;

    @Value("${brevo.sender.email:}")
    private String brevoSenderEmail;

    @Value("${brevo.sender.name:Manufolio}")
    private String brevoSenderName;

    @Value("${brevo.to.email:}")
    private String brevoToEmail;

    @Autowired
    public EmailNotificationServiceImpl(
            ContactRepository contactRepository,
            @Autowired(required = false) RestTemplate restTemplate) {
        this.contactRepository = contactRepository;
        if (restTemplate != null) {
            this.restTemplate = restTemplate;
        } else {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(5000);
            factory.setReadTimeout(5000);
            this.restTemplate = new RestTemplate(factory);
        }
    }

    @Override
    @Async("mailExecutor")
    public void sendContactNotificationAsync(Long contactId) {
        if (contactId == null) {
            log.warn("[EMAIL] Cannot send notification for null contactId");
            return;
        }

        Contact contact = contactRepository.findById(contactId).orElse(null);
        if (contact == null) {
            log.warn("[EMAIL] Contact record not found for contactId={}", contactId);
            return;
        }

        // Determine if required Brevo configuration is missing
        boolean isConfigured = brevoApiKey != null && !brevoApiKey.trim().isEmpty()
                && brevoSenderEmail != null && !brevoSenderEmail.trim().isEmpty()
                && brevoToEmail != null && !brevoToEmail.trim().isEmpty()
                && brevoApiUrl != null && !brevoApiUrl.trim().isEmpty();

        if (!isConfigured) {
            log.info("[EMAIL] Notification SKIPPED for contactId={}: Brevo API credentials not fully configured", contactId);
            contact.setEmailNotificationStatus(NotificationStatus.SKIPPED);
            contact.setEmailNotificationError("Brevo API credentials (BREVO_API_KEY/BREVO_SENDER_EMAIL/BREVO_TO_EMAIL) not configured");
            contactRepository.save(contact);
            return;
        }

        try {
            log.info("[EMAIL] Attempting Brevo notification delivery for contactId={}", contactId);

            String escapedName = HtmlUtils.htmlEscape(contact.getName());
            String escapedEmail = HtmlUtils.htmlEscape(contact.getEmail());
            String rawPhone = contact.getPhone();
            String escapedPhone = (rawPhone != null && !rawPhone.trim().isEmpty())
                    ? HtmlUtils.htmlEscape(rawPhone.trim())
                    : "Not provided";
            String escapedMessage = HtmlUtils.htmlEscape(contact.getMessage()).replace("\n", "<br/>");
            String plainMessage = contact.getMessage();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a 'IST'");
            String formattedDate = contact.getSentAt() != null
                    ? contact.getSentAt().format(formatter)
                    : LocalDateTime.now().format(formatter);

            String htmlBody = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                    .header { border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px; }
                    .title { color: #0f172a; font-size: 20px; font-weight: 700; margin: 0; }
                    .field { margin-bottom: 16px; }
                    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700; margin-bottom: 4px; display: block; }
                    .value { font-size: 15px; color: #0f172a; font-weight: 500; }
                    .message-box { background: #f1f5f9; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; margin-top: 8px; }
                    .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h2 class="title">📬 New Contact Message Received</h2>
                    </div>
                    <div class="field">
                      <span class="label">Sender Name</span>
                      <div class="value">%s</div>
                    </div>
                    <div class="field">
                      <span class="label">Email Address</span>
                      <div class="value"><a href="mailto:%s" style="color: #10b981; text-decoration: none;">%s</a></div>
                    </div>
                    <div class="field">
                      <span class="label">Phone Number</span>
                      <div class="value">%s</div>
                    </div>
                    <div class="field">
                      <span class="label">Message</span>
                      <div class="message-box">%s</div>
                    </div>
                    <div class="footer">
                      Submitted on %s via Manufolio Portfolio
                    </div>
                  </div>
                </body>
                </html>
                """, escapedName, escapedEmail, escapedEmail, escapedPhone, escapedMessage, formattedDate);

            String textBody = String.format("""
                New Manufolio Contact Message Received
                ---------------------------------------
                Sender Name: %s
                Email Address: %s
                Phone Number: %s
                Date: %s

                Message:
                %s

                Submitted via Manufolio Portfolio
                """, contact.getName(), contact.getEmail(), (rawPhone != null && !rawPhone.trim().isEmpty()) ? rawPhone.trim() : "Not provided", formattedDate, plainMessage);

            Map<String, Object> body = new HashMap<>();
            String senderName = (brevoSenderName != null && !brevoSenderName.trim().isEmpty()) ? brevoSenderName.trim() : "Manufolio";
            body.put("sender", Map.of("name", senderName, "email", brevoSenderEmail.trim()));
            body.put("to", List.of(Map.of("email", brevoToEmail.trim())));

            if (contact.getEmail() != null && contact.getEmail().contains("@")) {
                body.put("replyTo", Map.of("name", contact.getName(), "email", contact.getEmail().trim()));
            }

            body.put("subject", "New Manufolio Contact Message — " + contact.getName());
            body.put("htmlContent", htmlBody);
            body.put("textContent", textBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("api-key", brevoApiKey.trim());

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    brevoApiUrl.trim(),
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.CREATED) {
                contact.setEmailNotificationStatus(NotificationStatus.SENT);
                contact.setEmailNotificationSentAt(LocalDateTime.now());
                contact.setEmailNotificationError(null);
                contactRepository.save(contact);

                log.info("[EMAIL] Brevo notification accepted for contactId={}", contactId);
            } else {
                String errorMsg = "Brevo API returned status: " + response.getStatusCode();
                contact.setEmailNotificationStatus(NotificationStatus.FAILED);
                contact.setEmailNotificationError(errorMsg);
                contactRepository.save(contact);

                log.error("[EMAIL] Brevo notification FAILED for contactId={}: {}", contactId, errorMsg);
            }

        } catch (Exception e) {
            String rawMessage = e.getMessage() != null ? e.getMessage() : e.toString();
            if (brevoApiKey != null && !brevoApiKey.trim().isEmpty()) {
                rawMessage = rawMessage.replace(brevoApiKey.trim(), "******");
            }
            log.error("[EMAIL] Brevo notification FAILED for contactId={}: category={}, error={}",
                    contactId, e.getClass().getSimpleName(), rawMessage);

            contact.setEmailNotificationStatus(NotificationStatus.FAILED);
            contact.setEmailNotificationError(e.getClass().getSimpleName() + ": " + rawMessage);
            contactRepository.save(contact);
        }
    }
}

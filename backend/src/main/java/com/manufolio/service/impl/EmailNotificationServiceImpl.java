package com.manufolio.service.impl;

import com.manufolio.entity.Contact;
import com.manufolio.enums.NotificationStatus;
import com.manufolio.repository.ContactRepository;
import com.manufolio.service.EmailNotificationService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Implementation of EmailNotificationService.
 * Processes email delivery asynchronously without blocking HTTP requests or throwing exceptions.
 */
@Slf4j
@Service
public class EmailNotificationServiceImpl implements EmailNotificationService {

    private final ContactRepository contactRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${manufolio.mail.to:manuanandan686@gmail.com}")
    private String mailTo;

    @Autowired
    public EmailNotificationServiceImpl(
            ContactRepository contactRepository,
            @Autowired(required = false) JavaMailSender mailSender) {
        this.contactRepository = contactRepository;
        this.mailSender = mailSender;
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

        // Determine if mail configuration is missing
        boolean isConfigured = mailSender != null
                && mailUsername != null && !mailUsername.trim().isEmpty()
                && mailPassword != null && !mailPassword.trim().isEmpty()
                && mailTo != null && !mailTo.trim().isEmpty();

        if (!isConfigured) {
            log.info("[EMAIL] Notification SKIPPED for contactId={}: SMTP credentials not fully configured", contactId);
            contact.setEmailNotificationStatus(NotificationStatus.SKIPPED);
            contact.setEmailNotificationError("SMTP credentials (MAIL_USERNAME/MAIL_PASSWORD) not configured");
            contactRepository.save(contact);
            return;
        }

        try {
            log.info("[EMAIL] Attempting email notification delivery for contactId={}", contactId);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(mailUsername.trim());
            helper.setTo(mailTo.trim());

            if (contact.getEmail() != null && contact.getEmail().contains("@")) {
                helper.setReplyTo(contact.getEmail().trim());
            }

            helper.setSubject("New Manufolio Contact Message — " + contact.getName());

            String escapedName = HtmlUtils.htmlEscape(contact.getName());
            String escapedEmail = HtmlUtils.htmlEscape(contact.getEmail());
            String rawPhone = contact.getPhone();
            String escapedPhone = (rawPhone != null && !rawPhone.trim().isEmpty())
                    ? HtmlUtils.htmlEscape(rawPhone.trim())
                    : "Not provided";
            String escapedMessage = HtmlUtils.htmlEscape(contact.getMessage()).replace("\n", "<br/>");

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

            helper.setText(htmlBody, true);

            mailSender.send(mimeMessage);

            contact.setEmailNotificationStatus(NotificationStatus.SENT);
            contact.setEmailNotificationSentAt(LocalDateTime.now());
            contact.setEmailNotificationError(null);
            contactRepository.save(contact);

            log.info("[EMAIL] Notification SENT successfully for contactId={}", contactId);

        } catch (Exception e) {
            String rawMessage = e.getMessage() != null ? e.getMessage() : e.toString();
            if (mailPassword != null && !mailPassword.trim().isEmpty()) {
                rawMessage = rawMessage.replace(mailPassword.trim(), "******");
            }
            log.error("[EMAIL] Notification FAILED for contactId={}: category={}, error={}",
                    contactId, e.getClass().getSimpleName(), rawMessage);

            contact.setEmailNotificationStatus(NotificationStatus.FAILED);
            contact.setEmailNotificationError(e.getClass().getSimpleName() + ": " + rawMessage);
            contactRepository.save(contact);
        }
    }
}

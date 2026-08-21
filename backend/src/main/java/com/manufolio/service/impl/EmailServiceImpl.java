package com.manufolio.service.impl;

import com.manufolio.entity.Contact;
import com.manufolio.enums.NotificationStatus;
import com.manufolio.repository.ContactRepository;
import com.manufolio.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * EmailServiceImpl — handles Google SMTP email notifications via JavaMailSender.
 */
@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final ContactRepository contactRepository;

    @Value("${spring.mail.username:manuanandan686@gmail.com}")
    private String mailSender;

    @Value("${app.mail.recipient:manuanandan686@gmail.com}")
    private String mailRecipient;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public EmailServiceImpl(JavaMailSender javaMailSender, ContactRepository contactRepository) {
        this.javaMailSender = javaMailSender;
        this.contactRepository = contactRepository;
    }

    @Override
    public void sendContactNotificationEmail(Contact contact) {
        if (mailPassword == null || mailPassword.trim().isEmpty()) {
            log.warn("[SMTP] Google SMTP notification skipped for contact ID={}: MAIL_PASSWORD environment variable is not configured.", contact.getId());
            contact.setEmailNotificationStatus(NotificationStatus.FAILED);
            contact.setEmailNotificationError("MAIL_PASSWORD environment variable not set");
            contactRepository.save(contact);
            return;
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(mailSender);
            mailMessage.setTo(mailRecipient);

            String subjectText = contact.getSubject() != null && !contact.getSubject().trim().isEmpty()
                    ? contact.getSubject().trim()
                    : "General Inquiry";

            mailMessage.setSubject("New Manufolio Contact — " + subjectText);
            mailMessage.setReplyTo(contact.getEmail());

            StringBuilder body = new StringBuilder();
            body.append("You received a new message via Manufolio Portfolio contact form.\n\n");
            body.append("--------------------------------------------------\n");
            body.append("Visitor Name : ").append(contact.getName()).append("\n");
            body.append("Visitor Email: ").append(contact.getEmail()).append("\n");
            body.append("Phone Number : ").append(contact.getPhone() != null ? contact.getPhone() : "Not provided").append("\n");
            body.append("Subject      : ").append(subjectText).append("\n");
            body.append("Submitted At : ").append(contact.getSentAt()).append("\n");
            body.append("--------------------------------------------------\n\n");
            body.append("Message:\n").append(contact.getMessage()).append("\n\n");
            body.append("--------------------------------------------------\n");
            body.append("Reply directly to this email to respond to the visitor.");

            mailMessage.setText(body.toString());

            javaMailSender.send(mailMessage);

            contact.setEmailNotificationStatus(NotificationStatus.SENT);
            contact.setEmailNotificationSentAt(LocalDateTime.now());
            contact.setEmailNotificationError(null);
            contactRepository.save(contact);

            log.info("[SMTP] Google SMTP notification email delivered successfully for contact ID={}", contact.getId());
        } catch (Exception e) {
            String errorMsg = e.getMessage() != null ? e.getMessage() : String.valueOf(e);
            log.error("[SMTP] Failed to send Google SMTP notification email for contact ID={}: {}", contact.getId(), errorMsg);

            contact.setEmailNotificationStatus(NotificationStatus.FAILED);
            contact.setEmailNotificationError(errorMsg);
            contactRepository.save(contact);
        }
    }
}

package com.manufolio.service;

import com.manufolio.entity.Contact;

/**
 * Service for dispatching email notifications via JavaMailSender (Google SMTP).
 */
public interface EmailService {

    /**
     * Sends an email notification for a new contact form submission asynchronously or synchronously.
     *
     * @param contact the saved Contact entity
     */
    void sendContactNotificationEmail(Contact contact);
}

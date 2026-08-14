package com.manufolio.listener;

import com.manufolio.event.ContactSubmittedEvent;
import com.manufolio.service.EmailNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Event listener that handles ContactSubmittedEvent AFTER the database transaction successfully commits.
 */
@Slf4j
@Component
public class ContactEventListener {

    private final EmailNotificationService emailNotificationService;

    public ContactEventListener(EmailNotificationService emailNotificationService) {
        this.emailNotificationService = emailNotificationService;
    }

    /**
     * Fired strictly AFTER the transaction commits to MySQL (or immediately if outside a transaction).
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void handleContactSubmitted(ContactSubmittedEvent event) {
        log.info("[EVENT] ContactSubmittedEvent received after DB commit for contactId={}", event.getContactId());
        emailNotificationService.sendContactNotificationAsync(event.getContactId());
    }
}

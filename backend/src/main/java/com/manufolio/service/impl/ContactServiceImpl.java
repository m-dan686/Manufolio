package com.manufolio.service.impl;

import com.manufolio.entity.Contact;
import com.manufolio.mapper.ContactMapper;
import com.manufolio.repository.ContactRepository;
import com.manufolio.request.ContactRequest;
import com.manufolio.service.ContactService;
import com.manufolio.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * ContactService implementation — handles public contact form submissions.
 */
@Slf4j
@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;
    private final EmailService emailService;

    public ContactServiceImpl(
            ContactRepository contactRepository,
            ContactMapper contactMapper,
            EmailService emailService) {
        this.contactRepository = contactRepository;
        this.contactMapper = contactMapper;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public void submitContact(ContactRequest request) {
        String idempotencyKey = request.getIdempotencyKey();
        if (idempotencyKey != null && !idempotencyKey.trim().isEmpty()) {
            Optional<Contact> existing = contactRepository.findByIdempotencyKey(idempotencyKey.trim());
            if (existing.isPresent()) {
                log.info("[CONTACT] Idempotent retry detected for key='{}': message already saved (id={}) — skipping duplicate persistence",
                        idempotencyKey.trim(), existing.get().getId());
                return;
            }
        }

        Contact contact = contactMapper.toEntity(request);
        if (contact.getSentAt() == null) {
            contact.setSentAt(LocalDateTime.now());
        }
        if (contact.getUpdatedAt() == null) {
            contact.setUpdatedAt(LocalDateTime.now());
        }

        Contact savedContact = contactRepository.save(contact);
        log.info("[CONTACT] Contact message persisted: messageId={} from {} <{}>",
                savedContact.getId(), savedContact.getName(), savedContact.getEmail());

        // Dispatch Google SMTP Notification
        try {
            emailService.sendContactNotificationEmail(savedContact);
        } catch (Exception e) {
            log.error("[CONTACT] Email notification dispatch failed for messageId={}: {}", savedContact.getId(), e.getMessage());
        }
    }
}


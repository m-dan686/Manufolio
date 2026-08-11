package com.manufolio.mapper;

import com.manufolio.dto.ContactDTO;
import com.manufolio.entity.Contact;
import com.manufolio.request.ContactRequest;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Maps between Contact entity, ContactRequest, and ContactDTO.
 */
@Component
public class ContactMapper {

    /**
     * Convert a ContactRequest to a new Contact entity with explicit timestamp defaults.
     */
    public Contact toEntity(ContactRequest request) {
        String phoneInput = request.getPhone();
        String normalizedPhone = (phoneInput == null || phoneInput.trim().isEmpty()) ? null : phoneInput.trim();
        LocalDateTime now = LocalDateTime.now();

        return Contact.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phone(normalizedPhone)
                .message(request.getMessage().trim())
                .read(false)
                .sentAt(now)
                .updatedAt(now)
                .build();
    }

    /**
     * Convert a Contact entity to a ContactDTO for API response.
     */
    public ContactDTO toDTO(Contact contact) {
        return ContactDTO.builder()
                .id(contact.getId())
                .name(contact.getName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .message(contact.getMessage())
                .read(contact.getRead())
                .sentAt(contact.getSentAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }
}

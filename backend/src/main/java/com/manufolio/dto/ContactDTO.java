package com.manufolio.dto;

import lombok.Builder;
import lombok.Data;

import com.manufolio.enums.NotificationStatus;

import java.time.LocalDateTime;

/**
 * DTO exposed to the Admin CMS for contact message management.
 * Entity fields are mapped here — the entity is never returned directly.
 */
@Data
@Builder
public class ContactDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String message;
    private Boolean read;
    private NotificationStatus emailNotificationStatus;
    private LocalDateTime emailNotificationSentAt;
    private String emailNotificationError;
    private LocalDateTime sentAt;
    private LocalDateTime updatedAt;
}

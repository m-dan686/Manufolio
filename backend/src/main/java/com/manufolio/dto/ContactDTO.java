package com.manufolio.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO exposed to the frontend for a contact message.
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
    private LocalDateTime sentAt;
    private LocalDateTime updatedAt;
}

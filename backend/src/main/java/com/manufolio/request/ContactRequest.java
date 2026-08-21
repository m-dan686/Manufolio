package com.manufolio.request;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Request body for POST /api/contact/submit.
 * All fields are validated server-side — never trust frontend validation alone.
 */
@Data
public class ContactRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Size(max = 200, message = "Subject must not exceed 200 characters")
    private String subject;

    @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
    private String phone;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters")
    private String message;

    @Size(max = 64, message = "Idempotency key must not exceed 64 characters")
    private String idempotencyKey;

    public void setPhone(String phone) {
        this.phone = phone == null ? null : phone.trim();
    }
}

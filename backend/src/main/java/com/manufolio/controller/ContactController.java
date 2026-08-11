package com.manufolio.controller;

import com.manufolio.request.ContactRequest;
import com.manufolio.response.ApiResponse;
import com.manufolio.service.ContactService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contact controller — public endpoint for portfolio contact form submissions.
 */
@Slf4j
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /**
     * POST /api/contact/submit
     * Accepts and saves a contact message from the portfolio contact form.
     */
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<Void>> submit(
            @Valid @RequestBody ContactRequest request) {

        log.info("[CONTACT] Submission received from: {} <{}>", request.getName(), request.getEmail());
        contactService.submitContact(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent successfully"));
    }
}

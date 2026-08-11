package com.manufolio.controller;

import com.manufolio.dto.ContactDTO;
import com.manufolio.dto.StatsDTO;
import com.manufolio.response.ApiResponse;
import com.manufolio.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin controller — protected endpoints for CMS dashboard operations.
 * All endpoints require a valid JWT (enforced by SecurityConfig + JwtAuthFilter).
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * GET /api/admin/stats
     * Returns dashboard analytics: total, unread, today, week, month counts.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsDTO>> getStats() {
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved", adminService.getDashboardStats()));
    }

    /**
     * GET /api/admin/messages?page=0&size=10&sort=sentAt,desc&search=
     * Returns paginated, searchable, sortable contact messages.
     */
    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<Page<ContactDTO>>> getMessages(
            @RequestParam(defaultValue = "0")     int page,
            @RequestParam(defaultValue = "10")    int size,
            @RequestParam(defaultValue = "sentAt,desc") String sort,
            @RequestParam(defaultValue = "")      String search) {

        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        String directionStr = sortParts.length > 1 ? sortParts[1].toLowerCase() : "desc";

        // Whitelist sort fields to protect Spring Data
        if (!sortField.equals("sentAt") && !sortField.equals("name") && !sortField.equals("email") && !sortField.equals("phone") && !sortField.equals("read")) {
            throw new IllegalArgumentException("Invalid sort field: " + sortField);
        }
        if (!directionStr.equals("asc") && !directionStr.equals("desc")) {
            throw new IllegalArgumentException("Invalid sort direction: " + directionStr);
        }

        Sort.Direction direction = directionStr.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        Page<ContactDTO> messages = adminService.getMessages(search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved", messages));
    }

    /**
     * PATCH /api/admin/messages/{id}/read
     * Marks a specific message as read.
     */
    @PatchMapping("/messages/{id}/read")
    public ResponseEntity<ApiResponse<ContactDTO>> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", adminService.markAsRead(id)));
    }

    /**
     * PATCH /api/admin/messages/read-all
     * Marks all unread messages as read.
     */
    @PatchMapping("/messages/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        int count = adminService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success(count + " messages marked as read"));
    }

    /**
     * DELETE /api/admin/messages/{id}
     * Permanently deletes a contact message.
     */
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        adminService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted"));
    }
}

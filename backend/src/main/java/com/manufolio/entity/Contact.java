package com.manufolio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Contact entity — stores visitor messages submitted via the contact form.
 */
@Entity
@Table(name = "contacts", indexes = {
        @Index(name = "idx_contacts_email", columnList = "email"),
        @Index(name = "idx_contacts_sent_at", columnList = "sent_at"),
        @Index(name = "idx_contacts_is_read", columnList = "is_read")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean read = false;

    // ── Audit fields ──────────────────────────────────────────────────────────

    @CreatedDate
    @Column(name = "sent_at", nullable = true, updatable = false)
    private LocalDateTime sentAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.sentAt == null) {
            this.sentAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.read == null) {
            this.read = false;
        }
    }
}

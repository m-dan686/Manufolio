package com.manufolio.repository;

import com.manufolio.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    Optional<Contact> findByIdempotencyKey(String idempotencyKey);

    /**
     * Paginated search — searches name, email, or message content.
     */
    @Query("SELECT c FROM Contact c WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.message) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Contact> searchContacts(String search, Pageable pageable);

    long countByReadFalse();

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.sentAt >= :startOfDay")
    long countTodayMessages(LocalDateTime startOfDay);

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.sentAt >= :startOfWeek")
    long countThisWeekMessages(LocalDateTime startOfWeek);

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.sentAt >= :startOfMonth")
    long countThisMonthMessages(LocalDateTime startOfMonth);

    @Modifying
    @Query("UPDATE Contact c SET c.read = true WHERE c.read = false")
    int markAllAsRead();
}

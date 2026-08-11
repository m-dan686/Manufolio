package com.manufolio.service.impl;

import com.manufolio.dto.ContactDTO;
import com.manufolio.dto.StatsDTO;
import com.manufolio.entity.Contact;
import com.manufolio.exception.ResourceNotFoundException;
import com.manufolio.mapper.ContactMapper;
import com.manufolio.repository.ContactRepository;
import com.manufolio.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAdjusters;

/**
 * AdminService implementation — dashboard analytics, paginated message management.
 */
@Slf4j
@Service
public class AdminServiceImpl implements AdminService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;

    public AdminServiceImpl(ContactRepository contactRepository, ContactMapper contactMapper) {
        this.contactRepository = contactRepository;
        this.contactMapper = contactMapper;
    }

    @Override
    public StatsDTO getDashboardStats() {
        LocalDateTime now          = LocalDateTime.now();
        LocalDateTime startOfDay   = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek  = now.toLocalDate()
                .with(java.time.DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime startOfMonth = now.toLocalDate()
                .with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();

        StatsDTO stats = StatsDTO.builder()
                .totalMessages(contactRepository.count())
                .unreadMessages(contactRepository.countByReadFalse())
                .todayMessages(contactRepository.countTodayMessages(startOfDay))
                .thisWeekMessages(contactRepository.countThisWeekMessages(startOfWeek))
                .thisMonthMessages(contactRepository.countThisMonthMessages(startOfMonth))
                .build();

        log.debug("[ADMIN] Stats retrieved: total={}, unread={}", stats.getTotalMessages(), stats.getUnreadMessages());
        return stats;
    }

    @Override
    public Page<ContactDTO> getMessages(String search, Pageable pageable) {
        Page<Contact> page = contactRepository.searchContacts(search, pageable);
        log.debug("[ADMIN] Messages fetched: page={}, size={}, total={}", pageable.getPageNumber(), pageable.getPageSize(), page.getTotalElements());
        return page.map(contactMapper::toDTO);
    }

    @Override
    @Transactional
    public ContactDTO markAsRead(Long id) {
        Contact contact = getContactOrThrow(id);
        contact.setRead(true);
        contactRepository.save(contact);
        log.info("[ADMIN] Message {} marked as read", id);
        return contactMapper.toDTO(contact);
    }

    @Override
    @Transactional
    public int markAllAsRead() {
        int count = contactRepository.markAllAsRead();
        log.info("[ADMIN] {} messages marked as read (bulk)", count);
        return count;
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        Contact contact = getContactOrThrow(id);
        contactRepository.delete(contact);
        log.info("[ADMIN] Message {} deleted", id);
    }

    private Contact getContactOrThrow(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + id));
    }
}

package com.manufolio.service;

import com.manufolio.dto.ContactDTO;
import com.manufolio.dto.StatsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    StatsDTO getDashboardStats();

    Page<ContactDTO> getMessages(String search, Pageable pageable);

    ContactDTO markAsRead(Long id);

    int markAllAsRead();

    void deleteMessage(Long id);
}

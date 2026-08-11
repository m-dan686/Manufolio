package com.manufolio.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Dashboard analytics DTO.
 */
@Data
@Builder
public class StatsDTO {

    private long totalMessages;
    private long unreadMessages;
    private long todayMessages;
    private long thisWeekMessages;
    private long thisMonthMessages;
}

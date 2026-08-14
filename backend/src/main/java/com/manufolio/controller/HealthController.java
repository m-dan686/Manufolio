package com.manufolio.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

/**
 * Public lightweight health endpoint used by portfolio frontend for backend cold-start wake-up.
 */
@Slf4j
@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * GET /api/health
     * Lightweight ping returning {"status": "UP"}. Does not access database.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        log.debug("[HEALTH] Cold-start health check ping received");
        return ResponseEntity.ok(Collections.singletonMap("status", "UP"));
    }
}

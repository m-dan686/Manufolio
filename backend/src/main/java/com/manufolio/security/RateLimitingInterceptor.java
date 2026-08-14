package com.manufolio.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Basic single-instance spam protection rate limiter.
 * Limits IP addresses to a maximum of 5 requests per hour.
 */
@Component
public class RateLimitingInterceptor implements HandlerInterceptor {

    private final Map<String, List<Long>> requestHistory = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_HOUR = 5;
    private static final long ONE_HOUR_IN_MS = 3600000L;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Safe remote address retrieval for single-instance setups.
        String ip = request.getRemoteAddr();
        long now = System.currentTimeMillis();
        final boolean[] allowed = {true};

        requestHistory.compute(ip, (key, timestamps) -> {
            if (timestamps == null) {
                timestamps = new ArrayList<>();
            }
            // Remove timestamps older than 1 hour
            timestamps.removeIf(timestamp -> (now - timestamp) > ONE_HOUR_IN_MS);

            if (timestamps.size() >= MAX_REQUESTS_PER_HOUR) {
                allowed[0] = false;
            } else {
                timestamps.add(now);
            }
            return timestamps;
        });

        if (!allowed[0]) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Too many requests. Please try again later.\",\"status\":429}");
            return false;
        }

        // Prevent memory leak by removing stale entries when the cache grows
        if (requestHistory.size() > 500) {
            for (String key : requestHistory.keySet()) {
                requestHistory.computeIfPresent(key, (k, val) -> {
                    val.removeIf(t -> (now - t) > ONE_HOUR_IN_MS);
                    return val.isEmpty() ? null : val;
                });
            }
        }

        return true;
    }

    public void clearRequestHistory() {
        requestHistory.clear();
    }
}

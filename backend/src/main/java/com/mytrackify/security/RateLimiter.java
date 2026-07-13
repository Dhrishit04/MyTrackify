package com.mytrackify.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory sliding-window rate limiter for admin actions.
 * Uses a {@link ConcurrentHashMap} keyed by "adminEmail:action" so each
 * admin-action pair has its own counter. Windows are reset every minute.
 *
 * ponytail: in-memory, single-node. For horizontal scaling, replace with Redis.
 */
@Component
public class RateLimiter {

    /** Default max requests per window per key. */
    private static final int DEFAULT_MAX = 10;

    /** Window duration in minutes. */
    private static final long WINDOW_MINUTES = 1;

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    /**
     * Check whether the current request's admin (from the authenticated principal)
     * is allowed to perform {@code action}. The admin's email is resolved from
     * the SecurityContext.
     */
    public boolean allowRequest(String adminEmail, String action) {
        String key = adminEmail + ":" + action;
        Window window = windows.compute(key, (k, existing) -> {
            long now = System.currentTimeMillis();
            if (existing == null || now - existing.start > Duration.ofMinutes(WINDOW_MINUTES).toMillis()) {
                return new Window(now, new AtomicInteger(1));
            }
            existing.count.incrementAndGet();
            return existing;
        });
        return window.count.get() <= (action.contains("FLAG") ? 50 : DEFAULT_MAX);
    }

    /** Whether the current request is rate-limited. */
    public boolean isRateLimited(String adminEmail, String action) {
        return !allowRequest(adminEmail, action);
    }

    /** Optional: read the current admin's email from the request context. */
    public String currentAdminEmail() {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                    .currentRequestAttributes()).getRequest();
            // ponytail: email is not propagated through the request; rely on the caller.
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private record Window(long start, AtomicInteger count) {}
}
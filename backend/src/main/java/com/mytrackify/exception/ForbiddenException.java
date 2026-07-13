package com.mytrackify.exception;

/**
 * Authenticated but not permitted (RBAC denial). Mapped to HTTP 403.
 * Contrast with {@link UnauthorizedException} (not authenticated -> 401).
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}

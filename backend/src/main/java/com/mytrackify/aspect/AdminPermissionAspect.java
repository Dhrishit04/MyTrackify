package com.mytrackify.aspect;

import com.mytrackify.annotation.RequireAdminPermission;
import com.mytrackify.entity.AdminUser;
import com.mytrackify.entity.Student;
import com.mytrackify.exception.ForbiddenException;
import com.mytrackify.exception.UnauthorizedException;
import com.mytrackify.repository.AdminUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Enforces {@link RequireAdminPermission}: authentication, active admin status,
 * minimum access level, specific permission, and scope. Audit logging is done
 * explicitly by services/controllers via {@code AuditService}, not here.
 */
@Aspect
@Component
@Slf4j
public class AdminPermissionAspect {

    private final AdminUserRepository adminUserRepository;

    public AdminPermissionAspect(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Around("@annotation(requirePermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, RequireAdminPermission requirePermission) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Student student)) {
            throw new ForbiddenException("Admin access required");
        }

        AdminUser currentAdmin = adminUserRepository.findByStudentId(student.getId()).orElse(null);
        if (currentAdmin == null || !currentAdmin.isAdmin()) {
            throw new ForbiddenException("Admin user not found or inactive");
        }

        if (currentAdmin.getAdminRole().getAccessLevel() < requirePermission.minLevel().getAccessLevel()) {
            log.warn("Insufficient admin level: {} (required {}) accessing {}",
                    currentAdmin.getAdminRole().getLevel(), requirePermission.minLevel(), joinPoint.getSignature().getName());
            throw new ForbiddenException(
                    "Insufficient admin level. Required: " + requirePermission.minLevel() +
                    ", your level: " + currentAdmin.getAdminRole().getLevel());
        }

        if (!requirePermission.permission().isEmpty()
                && !currentAdmin.getAdminRole().hasPermission(requirePermission.permission())) {
            log.warn("Permission denied: {} for {}", requirePermission.permission(), student.getEmail());
            throw new ForbiddenException("Permission denied: " + requirePermission.permission());
        }

        if (!requirePermission.scope().isEmpty() && !currentAdmin.canAccessScope(requirePermission.scope())) {
            throw new ForbiddenException("Cannot access scope: " + requirePermission.scope());
        }

        return joinPoint.proceed();
    }
}

package com.mytrackify.service;

import com.mytrackify.entity.AdminAuditLog;
import com.mytrackify.entity.AdminUser;
import com.mytrackify.enums.AdminAction;
import com.mytrackify.repository.AdminAuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Writes {@link AdminAuditLog} entries for admin actions. Best-effort: a logging
 * failure must never break the business operation, so exceptions are swallowed
 * and logged.
 */
@Service
@Slf4j
public class AuditService {

    private final AdminAuditLogRepository auditLogRepository;

    public AuditService(AdminAuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(AdminAction action, AdminUser admin, Long targetId, String targetType,
                    String oldValue, String newValue, String reason) {
        try {
            HttpServletRequest request = currentRequest();
            AdminAuditLog entry = AdminAuditLog.builder()
                    .adminUser(admin)
                    .action(action)
                    .targetId(targetId)
                    .targetType(targetType)
                    .oldValue(oldValue)
                    .newValue(newValue)
                    .changeReason(reason)
                    .endpoint(request != null ? request.getRequestURI() : null)
                    .httpMethod(request != null ? request.getMethod() : null)
                    .ipAddress(request != null ? clientIp(request) : null)
                    .userAgent(request != null ? request.getHeader("User-Agent") : null)
                    .build();
            auditLogRepository.save(entry);
            log.info("Audit: {} by {} on {} (ID: {})", action, safeEmail(admin), targetType, targetId);
        } catch (Exception e) {
            log.error("Failed to create audit log for action: {}", action, e);
        }
    }

    public void logDataExport(AdminUser admin, String dataType, Integer recordCount, String reason) {
        log(AdminAction.EXPORTED_DATA, admin, null, dataType, null, String.valueOf(recordCount), reason);
    }

    public void logNotificationSent(AdminUser admin, String recipientGroup, String message) {
        log(AdminAction.SENT_NOTIFICATION, admin, null, recipientGroup, null, message, null);
    }

    public void logRoleAssigned(AdminUser admin, Long targetUserId, String roleName) {
        log(AdminAction.ASSIGNED_ROLE, admin, targetUserId, "USER", null, roleName, null);
    }

    public void logRoleRevoked(AdminUser admin, Long targetUserId, String roleName, String reason) {
        log(AdminAction.REVOKED_ROLE, admin, targetUserId, "USER", roleName, null, reason);
    }

    private String safeEmail(AdminUser admin) {
        return admin != null && admin.getStudent() != null ? admin.getStudent().getEmail() : "unknown";
    }

    private HttpServletRequest currentRequest() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            return attrs != null ? attrs.getRequest() : null;
        } catch (IllegalStateException e) {
            return null;
        }
    }

    private String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty()) {
            return xff.split(",")[0];
        }
        return request.getRemoteAddr();
    }
}

package com.mytrackify.enums;

/**
 * Every auditable admin action. Stored on {@code admin_audit_log.action}.
 */
public enum AdminAction {
    CREATED_COMPANY,
    UPDATED_COMPANY,
    ARCHIVED_COMPANY,
    VERIFIED_PROCESS,
    UPDATED_PROCESS,

    VERIFIED_EXPERIENCE,
    FLAGGED_EXPERIENCE,
    MERGED_EXPERIENCES,
    REQUESTED_REVISION,

    SUSPENDED_USER,
    DELETED_USER,
    RESET_PASSWORD,

    ASSIGNED_ROLE,
    REVOKED_ROLE,

    EXPORTED_DATA,
    SENT_NOTIFICATION,
    VIEWED_SALARY_DATA
}

package com.mytrackify.enums;

/**
 * Canonical permission strings used across the RBAC system.
 * Referenced by both {@link AdminLevel#getDefaultPermissions()} (seed) and
 * {@code @RequireAdminPermission(permission = ...)} annotations so there is a
 * single source of truth and no typo drift.
 */
public final class AdminPermissions {
    private AdminPermissions() {}

    public static final String COMPANY_READ = "COMPANY:READ";
    public static final String COMPANY_WRITE = "COMPANY:WRITE";
    public static final String COMPANY_DELETE = "COMPANY:DELETE";
    public static final String COMPANY_VERIFY = "COMPANY:VERIFY";

    public static final String EXPERIENCE_READ = "EXPERIENCE:READ";
    public static final String EXPERIENCE_WRITE = "EXPERIENCE:WRITE";
    public static final String EXPERIENCE_VERIFY = "EXPERIENCE:VERIFY";
    public static final String EXPERIENCE_FLAG = "EXPERIENCE:FLAG";
    public static final String EXPERIENCE_MERGE = "EXPERIENCE:MERGE";
    public static final String EXPERIENCE_COMMENT = "EXPERIENCE:COMMENT";

    public static final String USER_READ = "USER:READ";
    public static final String USER_SUSPEND = "USER:SUSPEND";
    public static final String USER_WRITE = "USER:WRITE";
    public static final String USER_DELETE = "USER:DELETE";

    public static final String ROLE_ASSIGN = "ROLE:ASSIGN";
    public static final String ROLE_REVOKE = "ROLE:REVOKE";
    public static final String ROLE_CREATE = "ROLE:CREATE";

    public static final String AUDIT_READ = "AUDIT:READ";
    public static final String AUDIT_EXPORT = "AUDIT:EXPORT";

    public static final String REPORT_GENERATE = "REPORT:GENERATE";
    public static final String REPORT_VIEW = "REPORT:VIEW";
    public static final String DATA_EXPORT = "DATA:EXPORT";

    public static final String DASHBOARD_VIEW = "DASHBOARD:VIEW";
    public static final String NOTIFICATION_SEND = "NOTIFICATION:SEND";
    public static final String CONTENT_MODERATE = "CONTENT:MODERATE";

    public static final String SYSTEM_CONFIGURE = "SYSTEM:CONFIGURE";
    public static final String SYSTEM_BACKUP = "SYSTEM:BACKUP";
}

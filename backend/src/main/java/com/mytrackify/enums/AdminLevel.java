package com.mytrackify.enums;

import java.util.Set;

/**
 * The four admin tiers. Higher accessLevel == more privilege.
 * {@link #getDefaultPermissions()} returns the spec's exact permission set per tier.
 */
public enum AdminLevel {
    SYSTEM_ADMIN(100, "System Administrator", "Complete system access"),
    DIRECTOR(70, "Placement Cell Director", "Strategic oversight and governance"),
    ASSOCIATE(45, "Associate Placement Officer", "Day-to-day operations"),
    MODERATOR(20, "Content Moderator", "Quality control only");

    private final int accessLevel;
    private final String displayName;
    private final String description;

    AdminLevel(int accessLevel, String displayName, String description) {
        this.accessLevel = accessLevel;
        this.displayName = displayName;
        this.description = description;
    }

    public int getAccessLevel() {
        return accessLevel;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    /** Hierarchy check: can this level act on behalf of (>=) another? */
    public boolean canAccessLevel(AdminLevel other) {
        return this.accessLevel >= other.accessLevel;
    }

    public Set<String> getDefaultPermissions() {
        return switch (this) {
            case SYSTEM_ADMIN -> Set.of(
                    AdminPermissions.COMPANY_READ, AdminPermissions.COMPANY_WRITE, AdminPermissions.COMPANY_DELETE, AdminPermissions.COMPANY_VERIFY,
                    AdminPermissions.EXPERIENCE_READ, AdminPermissions.EXPERIENCE_WRITE, AdminPermissions.EXPERIENCE_VERIFY,
                    AdminPermissions.EXPERIENCE_FLAG, AdminPermissions.EXPERIENCE_MERGE, AdminPermissions.EXPERIENCE_COMMENT,
                    AdminPermissions.USER_READ, AdminPermissions.USER_SUSPEND, AdminPermissions.USER_WRITE, AdminPermissions.USER_DELETE,
                    AdminPermissions.ROLE_ASSIGN, AdminPermissions.ROLE_REVOKE, AdminPermissions.ROLE_CREATE,
                    AdminPermissions.AUDIT_READ, AdminPermissions.AUDIT_EXPORT,
                    AdminPermissions.REPORT_GENERATE, AdminPermissions.REPORT_VIEW, AdminPermissions.DATA_EXPORT,
                    AdminPermissions.DASHBOARD_VIEW, AdminPermissions.NOTIFICATION_SEND, AdminPermissions.CONTENT_MODERATE,
                    AdminPermissions.SYSTEM_CONFIGURE, AdminPermissions.SYSTEM_BACKUP
            );
            case DIRECTOR -> Set.of(
                    AdminPermissions.COMPANY_READ, AdminPermissions.COMPANY_WRITE, AdminPermissions.COMPANY_VERIFY,
                    AdminPermissions.EXPERIENCE_READ, AdminPermissions.EXPERIENCE_WRITE, AdminPermissions.EXPERIENCE_VERIFY,
                    AdminPermissions.USER_READ, AdminPermissions.USER_SUSPEND,
                    AdminPermissions.ROLE_ASSIGN, AdminPermissions.ROLE_REVOKE,
                    AdminPermissions.AUDIT_READ, AdminPermissions.AUDIT_EXPORT,
                    AdminPermissions.REPORT_GENERATE, AdminPermissions.REPORT_VIEW, AdminPermissions.DATA_EXPORT,
                    AdminPermissions.DASHBOARD_VIEW
            );
            case ASSOCIATE -> Set.of(
                    AdminPermissions.COMPANY_READ,
                    AdminPermissions.EXPERIENCE_READ, AdminPermissions.EXPERIENCE_FLAG,
                    AdminPermissions.NOTIFICATION_SEND,
                    AdminPermissions.DASHBOARD_VIEW, AdminPermissions.REPORT_VIEW, AdminPermissions.DATA_EXPORT
            );
            case MODERATOR -> Set.of(
                    AdminPermissions.EXPERIENCE_READ, AdminPermissions.EXPERIENCE_FLAG, AdminPermissions.EXPERIENCE_COMMENT,
                    AdminPermissions.DASHBOARD_VIEW, AdminPermissions.CONTENT_MODERATE
            );
        };
    }
}

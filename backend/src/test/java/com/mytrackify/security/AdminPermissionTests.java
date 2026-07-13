package com.mytrackify.security;

import com.mytrackify.entity.AdminRole;
import com.mytrackify.enums.AdminLevel;
import com.mytrackify.enums.AdminPermissions;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the RBAC permission model (spec Week 5, Testing Strategy).
 */
class AdminPermissionTests {

    @Test
    void testAccessLevelValues() {
        assertEquals(100, AdminLevel.SYSTEM_ADMIN.getAccessLevel());
        assertEquals(70, AdminLevel.DIRECTOR.getAccessLevel());
        assertEquals(45, AdminLevel.ASSOCIATE.getAccessLevel());
        assertEquals(20, AdminLevel.MODERATOR.getAccessLevel());
    }

    @Test
    void testSystemAdminCanAccessAllLevels() {
        assertTrue(AdminLevel.SYSTEM_ADMIN.canAccessLevel(AdminLevel.DIRECTOR));
        assertTrue(AdminLevel.SYSTEM_ADMIN.canAccessLevel(AdminLevel.ASSOCIATE));
        assertTrue(AdminLevel.SYSTEM_ADMIN.canAccessLevel(AdminLevel.MODERATOR));
    }

    @Test
    void testModeratorCannotAccessHigherLevels() {
        assertFalse(AdminLevel.MODERATOR.canAccessLevel(AdminLevel.DIRECTOR));
        assertFalse(AdminLevel.MODERATOR.canAccessLevel(AdminLevel.ASSOCIATE));
        assertFalse(AdminLevel.MODERATOR.canAccessLevel(AdminLevel.SYSTEM_ADMIN));
    }

    @Test
    void testDirectorCanAccessAssociateAndModerator() {
        assertTrue(AdminLevel.DIRECTOR.canAccessLevel(AdminLevel.ASSOCIATE));
        assertTrue(AdminLevel.DIRECTOR.canAccessLevel(AdminLevel.MODERATOR));
        assertFalse(AdminLevel.DIRECTOR.canAccessLevel(AdminLevel.SYSTEM_ADMIN));
    }

    @Test
    void testSystemAdminHasAllPermissions() {
        AdminRole role = AdminRole.builder()
                .level(AdminLevel.SYSTEM_ADMIN)
                .roleName(AdminLevel.SYSTEM_ADMIN.getDisplayName())
                .accessLevel(AdminLevel.SYSTEM_ADMIN.getAccessLevel())
                .permissions(AdminLevel.SYSTEM_ADMIN.getDefaultPermissions())
                .build();

        assertTrue(role.hasPermission(AdminPermissions.COMPANY_DELETE));
        assertTrue(role.hasPermission(AdminPermissions.ROLE_ASSIGN));
        assertTrue(role.hasPermission(AdminPermissions.SYSTEM_CONFIGURE));
        assertTrue(role.hasPermission(AdminPermissions.USER_DELETE));
    }

    @Test
    void testModeratorCannotDeleteExperience() {
        AdminRole role = AdminRole.builder()
                .level(AdminLevel.MODERATOR)
                .roleName(AdminLevel.MODERATOR.getDisplayName())
                .accessLevel(AdminLevel.MODERATOR.getAccessLevel())
                .permissions(AdminLevel.MODERATOR.getDefaultPermissions())
                .build();

        assertFalse(role.hasPermission(AdminPermissions.COMPANY_DELETE));
        assertFalse(role.hasPermission(AdminPermissions.USER_DELETE));
        assertFalse(role.hasPermission(AdminPermissions.ROLE_ASSIGN));
    }

    @Test
    void testDirectorCanVerifyProcess() {
        AdminRole role = AdminRole.builder()
                .level(AdminLevel.DIRECTOR)
                .roleName(AdminLevel.DIRECTOR.getDisplayName())
                .accessLevel(AdminLevel.DIRECTOR.getAccessLevel())
                .permissions(AdminLevel.DIRECTOR.getDefaultPermissions())
                .build();

        assertTrue(role.hasPermission(AdminPermissions.COMPANY_VERIFY));
        assertTrue(role.hasPermission(AdminPermissions.EXPERIENCE_VERIFY));
        assertTrue(role.hasPermission(AdminPermissions.REPORT_GENERATE));
    }

    @Test
    void testAssociateHasLimitedPermissions() {
        AdminRole role = AdminRole.builder()
                .level(AdminLevel.ASSOCIATE)
                .roleName(AdminLevel.ASSOCIATE.getDisplayName())
                .accessLevel(AdminLevel.ASSOCIATE.getAccessLevel())
                .permissions(AdminLevel.ASSOCIATE.getDefaultPermissions())
                .build();

        assertTrue(role.hasPermission(AdminPermissions.COMPANY_READ));
        assertTrue(role.hasPermission(AdminPermissions.EXPERIENCE_FLAG));
        assertTrue(role.hasPermission(AdminPermissions.NOTIFICATION_SEND));
        assertFalse(role.hasPermission(AdminPermissions.COMPANY_WRITE));
        assertFalse(role.hasPermission(AdminPermissions.USER_READ));
        assertFalse(role.hasPermission(AdminPermissions.ROLE_ASSIGN));
    }

    @Test
    void testModeratorHasOnlyBasicPermissions() {
        AdminRole role = AdminRole.builder()
                .level(AdminLevel.MODERATOR)
                .roleName(AdminLevel.MODERATOR.getDisplayName())
                .accessLevel(AdminLevel.MODERATOR.getAccessLevel())
                .permissions(AdminLevel.MODERATOR.getDefaultPermissions())
                .build();

        assertTrue(role.hasPermission(AdminPermissions.EXPERIENCE_READ));
        assertTrue(role.hasPermission(AdminPermissions.EXPERIENCE_FLAG));
        assertTrue(role.hasPermission(AdminPermissions.EXPERIENCE_COMMENT));
        assertTrue(role.hasPermission(AdminPermissions.DASHBOARD_VIEW));
        assertTrue(role.hasPermission(AdminPermissions.CONTENT_MODERATE));
        assertFalse(role.hasPermission(AdminPermissions.COMPANY_WRITE));
        assertFalse(role.hasPermission(AdminPermissions.NOTIFICATION_SEND));
        assertFalse(role.hasPermission(AdminPermissions.USER_READ));
    }
}
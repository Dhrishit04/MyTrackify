package com.mytrackify.controller;

import com.mytrackify.annotation.RequireAdminPermission;
import com.mytrackify.dto.request.AssignRoleRequest;
import com.mytrackify.dto.request.FlagExperienceRequest;
import com.mytrackify.dto.request.MergeExperiencesRequest;
import com.mytrackify.dto.request.NotificationRequest;
import com.mytrackify.dto.request.RevokeRoleRequest;
import com.mytrackify.dto.request.RevisionRequest;
import com.mytrackify.dto.response.AdminUserSummary;
import com.mytrackify.dto.response.ApiResponse;
import com.mytrackify.dto.response.AuditLogResponse;
import com.mytrackify.dto.response.StudentAdminSummary;
import com.mytrackify.entity.AdminUser;
import com.mytrackify.entity.Company;
import com.mytrackify.entity.Student;
import com.mytrackify.enums.AdminLevel;
import com.mytrackify.enums.AdminPermissions;
import com.mytrackify.exception.ForbiddenException;
import com.mytrackify.exception.UnauthorizedException;
import com.mytrackify.repository.AdminUserRepository;
import com.mytrackify.security.RateLimiter;
import com.mytrackify.service.AdminUserService;
import com.mytrackify.service.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminUserService adminUserService;
    private final CompanyService companyService;
    private final AdminUserRepository adminUserRepository;
    private final RateLimiter rateLimiter;

    public AdminController(AdminUserService adminUserService,
                           CompanyService companyService,
                           AdminUserRepository adminUserRepository,
                           RateLimiter rateLimiter) {
        this.adminUserService = adminUserService;
        this.companyService = companyService;
        this.adminUserRepository = adminUserRepository;
        this.rateLimiter = rateLimiter;
    }

    @GetMapping("/dashboard")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR)
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        Map<String, Object> stats = adminUserService.getDashboardStats();
        stats.put("totalCompanies", companyService.getAllCompanies().size());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/students")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.USER_READ)
    public ResponseEntity<ApiResponse<List<StudentAdminSummary>>> getStudents() {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getStudents()));
    }

    @GetMapping("/companies")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.COMPANY_READ)
    public ResponseEntity<ApiResponse<List<Company>>> getCompanies() {
        return ResponseEntity.ok(ApiResponse.success(companyService.getAllCompanies()));
    }

    @GetMapping("/users")
    @RequireAdminPermission(minLevel = AdminLevel.SYSTEM_ADMIN)
    public ResponseEntity<ApiResponse<List<AdminUserSummary>>> getAdmins() {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getAllAdmins()));
    }

    @PostMapping("/users/{userId}/assign-role")
    @RequireAdminPermission(minLevel = AdminLevel.SYSTEM_ADMIN, permission = AdminPermissions.ROLE_ASSIGN)
    public ResponseEntity<ApiResponse<AdminUserSummary>> assignRole(
            @PathVariable Long userId, @RequestBody AssignRoleRequest request) {
        AdminUser by = requireCurrentAdmin();
        AdminUserSummary summary = adminUserService.assignRole(
                userId, request.getLevel(), request.getScope(), request.getDepartment(), by);
        return ResponseEntity.ok(ApiResponse.success(summary, "Role assigned successfully"));
    }

    @PostMapping("/users/{userId}/revoke-role")
    @RequireAdminPermission(minLevel = AdminLevel.SYSTEM_ADMIN, permission = AdminPermissions.ROLE_REVOKE)
    public ResponseEntity<ApiResponse<AdminUserSummary>> revokeRole(
            @PathVariable Long userId, @RequestBody RevokeRoleRequest request) {
        AdminUser by = requireCurrentAdmin();
        AdminUserSummary summary = adminUserService.revokeRole(userId, request.getReason(), by);
        return ResponseEntity.ok(ApiResponse.success(summary, "Role revoked successfully"));
    }

    @GetMapping("/audit-logs")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.AUDIT_READ)
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String adminEmail) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.getAuditLogs(pageable, action, adminEmail)));
    }

    // ==================== Domain operations under RBAC ====================

    @PostMapping("/experiences/{experienceId}/verify")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.EXPERIENCE_VERIFY)
    public ResponseEntity<ApiResponse<?>> verifyExperience(@PathVariable Long experienceId) {
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.verifyExperience(requireCurrentAdmin(), experienceId)));
    }

    @PostMapping("/experiences/{experienceId}/flag")
    @RequireAdminPermission(minLevel = AdminLevel.MODERATOR, permission = AdminPermissions.EXPERIENCE_FLAG)
    public ResponseEntity<ApiResponse<?>> flagExperience(@PathVariable Long experienceId,
                                                        @RequestBody FlagExperienceRequest request) {
        AdminUser admin = requireCurrentAdmin();
        String email = admin.getStudent() != null ? admin.getStudent().getEmail() : "unknown";
        if (!rateLimiter.allowRequest(email, "FLAG")) {
            return ResponseEntity.status(429).body(ApiResponse.error("Rate limit exceeded: max 50 flags per minute"));
        }
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.flagExperience(admin, experienceId, request.getReason())));
    }

    @PostMapping("/experiences/{experienceId}/request-revision")
    @RequireAdminPermission(minLevel = AdminLevel.MODERATOR, permission = AdminPermissions.CONTENT_MODERATE)
    public ResponseEntity<ApiResponse<?>> requestRevision(@PathVariable Long experienceId,
                                                          @RequestBody RevisionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.requestRevision(requireCurrentAdmin(), experienceId, request.getNote())));
    }

    @PostMapping("/processes/{processId}/verify")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.COMPANY_VERIFY)
    public ResponseEntity<ApiResponse<?>> verifyProcess(@PathVariable Long processId) {
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.verifyProcess(requireCurrentAdmin(), processId)));
    }

    @PostMapping("/notifications/send")
    @RequireAdminPermission(minLevel = AdminLevel.ASSOCIATE, permission = AdminPermissions.NOTIFICATION_SEND)
    public ResponseEntity<ApiResponse<?>> sendNotification(@RequestBody NotificationRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.sendNotification(requireCurrentAdmin(),
                        request.getRecipientGroup(), request.getMessage())));
    }

    @GetMapping("/moderation/queue")
    @RequireAdminPermission(minLevel = AdminLevel.MODERATOR, permission = AdminPermissions.CONTENT_MODERATE)
    public ResponseEntity<ApiResponse<Page<?>>> getModerationQueue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.getModerationQueue(PageRequest.of(page, size))));
    }

    @GetMapping("/data/export")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.DATA_EXPORT)
    public ResponseEntity<String> exportCompanies() {
        String csv = adminUserService.exportCompaniesCsv(requireCurrentAdmin());
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"companies_export.csv\"")
                .contentType(org.springframework.http.MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    // ==================== NEW: Missing spec endpoints ====================

    @PostMapping("/experiences/merge")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.EXPERIENCE_MERGE)
    public ResponseEntity<ApiResponse<?>> mergeExperiences(@RequestBody MergeExperiencesRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.mergeExperiences(requireCurrentAdmin(),
                        request.getPrimaryId(), request.getDuplicateIds())));
    }

    @GetMapping("/reports/placement")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.REPORT_GENERATE)
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlacementReport() {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getPlacementReport()));
    }

    @GetMapping("/analytics/dashboard")
    @RequireAdminPermission(minLevel = AdminLevel.ASSOCIATE, permission = AdminPermissions.DASHBOARD_VIEW)
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalyticsDashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getPlacementReport()));
    }

    @GetMapping("/analytics/placement-progress")
    @RequireAdminPermission(minLevel = AdminLevel.ASSOCIATE, permission = AdminPermissions.REPORT_VIEW)
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlacementProgress() {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getPlacementProgress()));
    }

    @PostMapping("/experiences/{experienceId}/suggest-tags")
    @RequireAdminPermission(minLevel = AdminLevel.MODERATOR, permission = AdminPermissions.CONTENT_MODERATE)
    public ResponseEntity<ApiResponse<?>> suggestTags(
            @PathVariable Long experienceId, @RequestBody List<String> tags) {
        return ResponseEntity.ok(ApiResponse.success(
                adminUserService.suggestTags(requireCurrentAdmin(), experienceId, tags)));
    }

    @GetMapping("/audit-logs/export")
    @RequireAdminPermission(minLevel = AdminLevel.DIRECTOR, permission = AdminPermissions.AUDIT_EXPORT)
    public ResponseEntity<String> exportAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "500") int size) {
        String csv = adminUserService.exportAuditLogsCsv(requireCurrentAdmin(), PageRequest.of(page, size));
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"audit_logs_export.csv\"")
                .contentType(org.springframework.http.MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    private AdminUser requireCurrentAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Student student) {
            return adminUserRepository.findByStudentId(student.getId())
                    .orElseThrow(() -> new ForbiddenException("Admin user not found"));
        }
        throw new UnauthorizedException("Admin access required");
    }
}

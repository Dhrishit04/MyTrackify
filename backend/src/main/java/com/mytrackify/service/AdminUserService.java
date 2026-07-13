package com.mytrackify.service;

import com.mytrackify.dto.response.AdminUserSummary;
import com.mytrackify.dto.response.AuditLogResponse;
import com.mytrackify.dto.response.StudentAdminSummary;
import com.mytrackify.entity.AdminRole;
import com.mytrackify.entity.AdminUser;
import com.mytrackify.entity.Company;
import com.mytrackify.entity.InterviewExperience;
import com.mytrackify.entity.InterviewProcess;
import com.mytrackify.entity.Student;
import com.mytrackify.enums.AdminAction;
import com.mytrackify.enums.AdminLevel;
import com.mytrackify.exception.ResourceNotFoundException;
import com.mytrackify.repository.AdminAuditLogRepository;
import com.mytrackify.repository.AdminRoleRepository;
import com.mytrackify.repository.AdminUserRepository;
import com.mytrackify.repository.ApplicationJourneyRepository;
import com.mytrackify.repository.CompanyRepository;
import com.mytrackify.repository.InterviewExperienceRepository;
import com.mytrackify.repository.StudentRepository;
import com.mytrackify.service.InterviewService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final AdminRoleRepository adminRoleRepository;
    private final StudentRepository studentRepository;
    private final InterviewExperienceRepository experienceRepository;
    private final ApplicationJourneyRepository journeyRepository;
    private final AdminAuditLogRepository auditLogRepository;
    private final AuditService auditService;
    private final InterviewService interviewService;
    private final CompanyRepository companyRepository;

    public AdminUserService(AdminUserRepository adminUserRepository,
                            AdminRoleRepository adminRoleRepository,
                            StudentRepository studentRepository,
                            InterviewExperienceRepository experienceRepository,
                            ApplicationJourneyRepository journeyRepository,
                            AdminAuditLogRepository auditLogRepository,
                            AuditService auditService,
                            InterviewService interviewService,
                            CompanyRepository companyRepository) {
        this.adminUserRepository = adminUserRepository;
        this.adminRoleRepository = adminRoleRepository;
        this.studentRepository = studentRepository;
        this.experienceRepository = experienceRepository;
        this.journeyRepository = journeyRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditService = auditService;
        this.interviewService = interviewService;
        this.companyRepository = companyRepository;
    }

    public Optional<AdminUser> getCurrentAdmin(Long userId) {
        return adminUserRepository.findByStudentId(userId);
    }

    public List<AdminUserSummary> getAllAdmins() {
        return adminUserRepository.findAll().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    public List<StudentAdminSummary> getStudents() {
        return studentRepository.findAll().stream()
                .map(s -> StudentAdminSummary.builder()
                        .id(s.getId())
                        .email(s.getEmail())
                        .anonymizedId(s.getAnonymizedId())
                        .branch(s.getBranch())
                        .graduationYear(s.getGraduationYear())
                        .cgpaRange(s.getCgpaRange())
                        .role(s.getRole())
                        .isActive(s.getIsActive())
                        .build())
                .collect(Collectors.toList());
    }

    /** Real dashboard stats (analytics engine is still a stub, so we count from the DB). */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalCompanies", 0L); // injected by controller via CompanyService if needed
        stats.put("totalExperiences", experienceRepository.count());
        stats.put("totalApplications", journeyRepository.count());
        stats.put("activeUsers", studentRepository.countByIsActiveTrue());
        stats.put("pendingVerifications", experienceRepository.countByVerifiedFalse());
        stats.put("totalAdmins", adminUserRepository.count());
        return stats;
    }

    @Transactional
    public AdminUserSummary assignRole(Long userId, AdminLevel level, String scope,
                                       String department, AdminUser by) {
        Student student = studentRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + userId));
        AdminRole role = adminRoleRepository.findByLevel(level)
                .orElseThrow(() -> new ResourceNotFoundException("Admin role not found: " + level));

        AdminUser adminUser = adminUserRepository.findByStudentId(userId)
                .map(existing -> {
                    existing.setAdminRole(role);
                    existing.setScope(scope);
                    existing.setDepartment(department);
                    existing.setIsActive(true);
                    existing.setRevokedAt(null);
                    existing.setRevocationReason(null);
                    return existing;
                })
                .orElseGet(() -> AdminUser.builder()
                        .student(student)
                        .adminRole(role)
                        .scope(scope)
                        .department(department)
                        .isActive(true)
                        .assignedBy(by)
                        .build());

        adminUser = adminUserRepository.save(adminUser);

        // Keep the coarse Student.role hint in sync for the frontend/Sidebar.
        student.setRole("ADMIN");
        studentRepository.save(student);

        auditService.logRoleAssigned(by, userId, level.name());
        return toSummary(adminUser);
    }

    @Transactional
    public AdminUserSummary revokeRole(Long userId, String reason, AdminUser by) {
        AdminUser adminUser = adminUserRepository.findByStudentId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No admin role assigned to student: " + userId));

        adminUser.revoke(reason);
        adminUser = adminUserRepository.save(adminUser);

        Student student = adminUser.getStudent();
        student.setRole("STUDENT");
        studentRepository.save(student);

        auditService.logRoleRevoked(by, userId, adminUser.getAdminRole().getLevel().name(), reason);
        return toSummary(adminUser);
    }

    public Page<AuditLogResponse> getAuditLogs(Pageable pageable, String action, String email) {
        Page<AdminAuditLogView> page;
        if (action != null && !action.isBlank()) {
            AdminAction parsed = AdminAction.valueOf(action.trim().toUpperCase());
            page = auditLogRepository.findByAction(parsed, pageable).map(this::toAuditView);
        } else if (email != null && !email.isBlank()) {
            page = auditLogRepository.findByAdminUserStudentEmail(email.trim(), pageable).map(this::toAuditView);
        } else {
            page = auditLogRepository.findAll(pageable).map(this::toAuditView);
        }
        return page.map(v -> AuditLogResponse.builder()
                .id(v.id)
                .adminEmail(v.adminEmail)
                .action(v.action)
                .targetType(v.targetType)
                .targetId(v.targetId)
                .changeReason(v.changeReason)
                .endpoint(v.endpoint)
                .httpMethod(v.httpMethod)
                .createdAt(v.createdAt)
                .build());
    }

    private AdminUserSummary toSummary(AdminUser a) {
        return AdminUserSummary.builder()
                .id(a.getId())
                .studentId(a.getStudent() != null ? a.getStudent().getId() : null)
                .email(a.getStudent() != null ? a.getStudent().getEmail() : null)
                .anonymizedId(a.getStudent() != null ? a.getStudent().getAnonymizedId() : null)
                .level(a.getAdminRole() != null ? a.getAdminRole().getLevel() : null)
                .roleName(a.getAdminRole() != null ? a.getAdminRole().getRoleName() : null)
                .accessLevel(a.getAdminRole() != null ? a.getAdminRole().getAccessLevel() : null)
                .scope(a.getScope())
                .department(a.getDepartment())
                .isActive(a.getIsActive())
                .assignedAt(a.getAssignedAt())
                .revokedAt(a.getRevokedAt())
                .build();
    }

    /** Lightweight projection to avoid loading the lazy AdminUser relation in bulk. */
    private record AdminAuditLogView(Long id, String adminEmail, AdminAction action, String targetType,
                                     Long targetId, String changeReason, String endpoint, String httpMethod,
                                     java.time.LocalDateTime createdAt) {
    }

    private AdminAuditLogView toAuditView(com.mytrackify.entity.AdminAuditLog log) {
        String email = log.getAdminUser() != null && log.getAdminUser().getStudent() != null
                ? log.getAdminUser().getStudent().getEmail() : "system";
        return new AdminAuditLogView(log.getId(), email, log.getAction(), log.getTargetType(),
                log.getTargetId(), log.getChangeReason(), log.getEndpoint(), log.getHttpMethod(), log.getCreatedAt());
    }

    // ==================== Domain operations under RBAC ====================

    @Transactional
    public InterviewExperience verifyExperience(AdminUser admin, Long experienceId) {
        InterviewExperience e = interviewService.markAsVerified(experienceId);
        auditService.log(AdminAction.VERIFIED_EXPERIENCE, admin, experienceId, "EXPERIENCE",
                "false", "true", null);
        return e;
    }

    @Transactional
    public InterviewExperience flagExperience(AdminUser admin, Long experienceId, String reason) {
        InterviewExperience e = interviewService.flagExperience(experienceId, reason);
        auditService.log(AdminAction.FLAGGED_EXPERIENCE, admin, experienceId, "EXPERIENCE",
                null, reason, reason);
        return e;
    }

    @Transactional
    public InterviewExperience requestRevision(AdminUser admin, Long experienceId, String note) {
        InterviewExperience e = interviewService.requestRevision(experienceId, note);
        auditService.log(AdminAction.REQUESTED_REVISION, admin, experienceId, "EXPERIENCE",
                null, note, note);
        return e;
    }

    @Transactional
    public InterviewProcess verifyProcess(AdminUser admin, Long processId) {
        InterviewProcess p = interviewService.verifyProcess(processId);
        auditService.log(AdminAction.VERIFIED_PROCESS, admin, processId, "PROCESS",
                null, null, null);
        return p;
    }

    public Map<String, Object> sendNotification(AdminUser admin, String recipientGroup, String message) {
        auditService.logNotificationSent(admin, recipientGroup, message);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "ACCEPTED");
        result.put("recipientGroup", recipientGroup);
        result.put("message", message);
        return result;
    }

    public org.springframework.data.domain.Page<InterviewExperience> getModerationQueue(org.springframework.data.domain.Pageable pageable) {
        return interviewService.getFlaggedExperiences(pageable);
    }

    /** CSV export of companies (anonymized, no PII). Audited. */
    public String exportCompaniesCsv(AdminUser admin) {
        List<Company> companies = companyRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("id,name,sector,avgCtcRange,totalApplications,totalOffers,avgSuccessRate\n");
        for (Company c : companies) {
            sb.append(String.join(",",
                    String.valueOf(c.getId()),
                    c.getName(),
                    c.getSector() != null ? c.getSector() : "",
                    c.getAvgCtcRange() != null ? c.getAvgCtcRange() : "",
                    String.valueOf(c.getTotalApplications()),
                    String.valueOf(c.getTotalOffers()),
                    c.getAvgSuccessRate() != null ? c.getAvgSuccessRate().toString() : ""));
            sb.append("\n");
        }
        auditService.logDataExport(admin, "COMPANIES", companies.size(), "Admin export");
        return sb.toString();
    }

    @Transactional
    public InterviewExperience mergeExperiences(AdminUser admin, Long primaryId, List<Long> duplicateIds) {
        InterviewExperience e = interviewService.mergeExperiences(primaryId, duplicateIds);
        auditService.log(AdminAction.MERGED_EXPERIENCES, admin, primaryId, "EXPERIENCE",
                "duplicates: " + duplicateIds, "merged into " + primaryId, null);
        return e;
    }

    @Transactional
    public InterviewExperience suggestTags(AdminUser admin, Long experienceId, List<String> tags) {
        return interviewService.suggestTags(experienceId, tags);
    }

    public Map<String, Object> getPlacementReport() {
        return interviewService.getPlacementReport();
    }

    public Map<String, Object> getPlacementProgress() {
        return interviewService.getPlacementProgress();
    }

    /** CSV export of audit logs. */
    public String exportAuditLogsCsv(AdminUser admin, Pageable pageable) {
        Page<AuditLogResponse> logs = getAuditLogs(pageable, null, null);
        StringBuilder sb = new StringBuilder();
        sb.append("id,action,adminEmail,targetType,targetId,reason,endpoint,httpMethod,createdAt\n");
        for (AuditLogResponse l : logs.getContent()) {
            sb.append(String.join(",",
                    String.valueOf(l.getId()),
                    l.getAction() != null ? l.getAction().name() : "",
                    l.getAdminEmail() != null ? l.getAdminEmail() : "",
                    l.getTargetType() != null ? l.getTargetType() : "",
                    l.getTargetId() != null ? String.valueOf(l.getTargetId()) : "",
                    l.getChangeReason() != null ? l.getChangeReason() : "",
                    l.getEndpoint() != null ? l.getEndpoint() : "",
                    l.getHttpMethod() != null ? l.getHttpMethod() : "",
                    l.getCreatedAt() != null ? l.getCreatedAt().toString() : ""));
            sb.append("\n");
        }
        auditService.logDataExport(admin, "AUDIT_LOGS", (int) logs.getTotalElements(), "Audit log export");
        return sb.toString();
    }
}

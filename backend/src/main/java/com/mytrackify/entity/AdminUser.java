package com.mytrackify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_users", uniqueConstraints = @UniqueConstraint(columnNames = "student_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private AdminRole adminRole;

    // Scope limitation: 'ALL', 'BATCH_2024', 'BATCH_2025', 'BATCH_2026', 'COMPANIES_ONLY'
    @Column(nullable = false)
    private String scope;

    @Column
    private String department;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // Audit trail - who assigned this role
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by")
    private AdminUser assignedBy;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;

    @Column(columnDefinition = "TEXT")
    private String revocationReason;

    @PrePersist
    protected void onCreate() {
        this.assignedAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
    }

    public boolean isAdmin() {
        return Boolean.TRUE.equals(isActive) && revokedAt == null;
    }

    public boolean canAccessScope(String requestedScope) {
        if ("ALL".equals(this.scope)) {
            return true;
        }
        return this.scope != null && this.scope.equals(requestedScope);
    }

    public void updateLastActive() {
        this.lastActiveAt = LocalDateTime.now();
    }

    public void revoke(String reason) {
        this.isActive = false;
        this.revokedAt = LocalDateTime.now();
        this.revocationReason = reason;
    }

    public boolean hasPermission(String permission) {
        return isAdmin() && adminRole != null && adminRole.hasPermission(permission);
    }
}

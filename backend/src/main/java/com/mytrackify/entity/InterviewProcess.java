package com.mytrackify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * InterviewProcess entity — represents a company's interview process for a specific academic year.
 * Rounds are stored as JSON string (JSONB in PostgreSQL).
 */
@Entity
@Table(name = "interview_processes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"company_id", "academic_year", "semester"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InterviewProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear; // e.g., "2024-25"

    @Column(length = 20)
    private String semester; // Fall, Spring

    // JSON string representing rounds array
    // In PostgreSQL, this would be JSONB type
    @Column(columnDefinition = "TEXT")
    private String rounds;

    @Builder.Default
    @Column(name = "verified_count")
    private Integer verifiedCount = 0;

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;

    @Builder.Default
    @Column(name = "is_current")
    private Boolean isCurrent = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

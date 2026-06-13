package com.mytrackify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Student entity — represents a registered student on the platform.
 * Contains academic profile, coding stats, and skill vector for similarity matching.
 */
@Entity
@Table(name = "students")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "college_id", nullable = false, length = 50)
    private String collegeId;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Column(nullable = false, length = 100)
    private String branch;

    @Column(name = "cgpa_range", length = 20)
    private String cgpaRange;

    @Column(name = "anonymized_id", unique = true, nullable = false, length = 50)
    private String anonymizedId;

    // --- Skill Profile ---
    @Builder.Default
    @Column(name = "leetcode_count")
    private Integer leetcodeCount = 0;

    @Builder.Default
    @Column(name = "leetcode_easy")
    private Integer leetcodeEasy = 0;

    @Builder.Default
    @Column(name = "leetcode_medium")
    private Integer leetcodeMedium = 0;

    @Builder.Default
    @Column(name = "leetcode_hard")
    private Integer leetcodeHard = 0;

    @Column(name = "contest_rating")
    private Integer contestRating;

    // Skill vector stored as comma-separated for H2 compatibility
    // In PostgreSQL production, this would be NUMERIC[]
    @Column(name = "skill_vector", length = 500)
    private String skillVector;

    // --- Metadata ---
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Builder.Default
    @Column(length = 20)
    private String role = "STUDENT"; // STUDENT, ADMIN, TPO

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.anonymizedId == null) {
            this.anonymizedId = "STUDENT_" + java.util.UUID.randomUUID()
                    .toString().substring(0, 8).toUpperCase();
        }
    }
}

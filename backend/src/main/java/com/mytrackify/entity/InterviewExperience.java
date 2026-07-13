package com.mytrackify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_experiences")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InterviewExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private RoundAttempt attempt;

    @Column(name = "questions_asked", nullable = false, columnDefinition = "TEXT")
    private String questionsAsked;

    // Comma-separated topics (in PostgreSQL, this would be TEXT[])
    @Column(length = 500)
    private String topics;

    @Column(name = "interviewer_focus", columnDefinition = "TEXT")
    private String interviewerFocus;

    @Column(name = "preparation_tips", columnDefinition = "TEXT")
    private String preparationTips;

    @Column(name = "difficulty_rating")
    private Integer difficultyRating; // 1-5

    @Builder.Default
    @Column(name = "helpful_count")
    private Integer helpfulCount = 0;

    @Builder.Default
    @Column
    private Boolean verified = false;

    @Builder.Default
    @Column
    private Boolean flagged = false;

    @Column(name = "flag_reason", columnDefinition = "TEXT")
    private String flagReason;

    @Builder.Default
    @Column(name = "revision_requested")
    private Boolean revisionRequested = false;

    @Column(name = "revision_note", columnDefinition = "TEXT")
    private String revisionNote;

    @Column(name = "merged_into_id")
    private Long mergedIntoId;

    @Column(name = "suggested_tags", columnDefinition = "TEXT")
    private String suggestedTags; // Comma-separated tags suggested by moderators

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

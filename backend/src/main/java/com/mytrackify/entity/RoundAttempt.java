package com.mytrackify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * RoundAttempt entity — a student's attempt at a specific interview round.
 */
@Entity
@Table(name = "round_attempts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RoundAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journey_id", nullable = false)
    private ApplicationJourney journey;

    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;

    @Column(name = "round_type", length = 100)
    private String roundType; // OA, Technical, HR, Managerial

    @Column(nullable = false, length = 50)
    private String outcome; // Passed, Failed, Pending

    @Column(name = "difficulty_perceived")
    private Integer difficultyPerceived; // 1-5

    @Column(name = "attempted_at")
    private LocalDateTime attemptedAt;

    @Column(name = "result_received_at")
    private LocalDateTime resultReceivedAt;

    @OneToOne(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private InterviewExperience experience;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

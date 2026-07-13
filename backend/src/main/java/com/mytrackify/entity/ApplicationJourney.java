package com.mytrackify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "application_journeys")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ApplicationJourney {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id")
    private InterviewProcess process;

    @Column(name = "application_type", length = 50)
    private String applicationType; // On-Campus, Off-Campus

    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate;

    @Column(name = "final_outcome", nullable = false, length = 50)
    private String finalOutcome; // Selected, Rejected, In Progress, Withdrew

    @Column(name = "final_round_reached")
    private Integer finalRoundReached;

    @Column(name = "compensation_offered", precision = 10, scale = 2)
    private BigDecimal compensationOffered;

    @Column(name = "role_offered")
    private String roleOffered;

    @OneToMany(mappedBy = "journey", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RoundAttempt> roundAttempts = new ArrayList<>();

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

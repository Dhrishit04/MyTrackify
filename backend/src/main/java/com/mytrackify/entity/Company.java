package com.mytrackify.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(length = 100)
    private String sector; // Product, Service, Trading, Consulting

    @Column(name = "headquarters_location")
    private String headquartersLocation;

    @Column(length = 500)
    private String website;

    @Column(name = "visit_frequency", length = 50)
    private String visitFrequency; // Annual, Bi-Annual, Once

    @Column(name = "typical_roles", length = 500)
    private String typicalRoles; // Comma-separated: SDE,Data Analyst,QA

    @Column(name = "avg_ctc_range", length = 50)
    private String avgCtcRange; // e.g., "10-15 LPA"

    // Aggregated stats (denormalized)
    @Builder.Default
    @Column(name = "total_applications")
    private Integer totalApplications = 0;

    @Builder.Default
    @Column(name = "total_offers")
    private Integer totalOffers = 0;

    @Column(name = "avg_success_rate", precision = 5, scale = 2)
    private BigDecimal avgSuccessRate;

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

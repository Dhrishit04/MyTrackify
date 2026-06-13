package com.mytrackify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDetailResponse {
    private Long id;
    private String name;
    private String sector;
    private String headquartersLocation;
    private String website;
    private String visitFrequency;
    private List<String> typicalRoles;
    private String avgCtcRange;

    private CompanyStats stats;
    private ProcessInfo currentProcess;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyStats {
        private Integer totalApplications;
        private Integer offersGiven;
        private BigDecimal successRate;
        private String avgCtc;
        private String lastVisit;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProcessInfo {
        private String academicYear;
        private String rounds; // JSON string
        private Integer verifiedCount;
    }
}

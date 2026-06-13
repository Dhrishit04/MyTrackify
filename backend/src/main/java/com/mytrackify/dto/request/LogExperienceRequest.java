package com.mytrackify.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class LogExperienceRequest {
    @NotNull(message = "Company ID is required")
    private Long companyId;

    private String applicationType = "On-Campus";

    @NotNull(message = "Application date is required")
    private String applicationDate;

    private String finalOutcome = "In Progress";

    @NotEmpty(message = "At least one round is required")
    private List<RoundData> rounds;

    @Data
    public static class RoundData {
        private int roundNumber;
        private String roundType;
        private String outcome;
        private int difficulty;
        private String questionsAsked;
        private List<String> topics;
        private String preparationTips;
    }
}

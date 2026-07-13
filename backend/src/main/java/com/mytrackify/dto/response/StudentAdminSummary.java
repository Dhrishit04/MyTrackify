package com.mytrackify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAdminSummary {
    private Long id;
    private String email;
    private String anonymizedId;
    private String branch;
    private Integer graduationYear;
    private String cgpaRange;
    private String role;
    private Boolean isActive;
}

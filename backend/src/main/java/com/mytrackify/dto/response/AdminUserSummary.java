package com.mytrackify.dto.response;

import com.mytrackify.enums.AdminLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserSummary {
    private Long id;
    private Long studentId;
    private String email;
    private String anonymizedId;
    private AdminLevel level;
    private String roleName;
    private Integer accessLevel;
    private String scope;
    private String department;
    private Boolean isActive;
    private LocalDateTime assignedAt;
    private LocalDateTime revokedAt;
}

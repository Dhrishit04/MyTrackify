package com.mytrackify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private StudentSummary user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentSummary {
        private Long id;
        private String email;
        private String anonymizedId;
        private String branch;
        private Integer graduationYear;
        private String cgpaRange;
        private String role;

        // Admin RBAC fields (null when the user is not an admin)
        private Boolean isAdmin;
        private String adminLevel;
        private Integer adminAccessLevel;
        private String scope;
        private List<String> permissions;
    }
}

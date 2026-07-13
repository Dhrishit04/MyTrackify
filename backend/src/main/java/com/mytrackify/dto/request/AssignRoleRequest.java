package com.mytrackify.dto.request;

import com.mytrackify.enums.AdminLevel;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignRoleRequest {
    @NotNull
    private AdminLevel level;

    private String scope = "ALL";

    private String department;
}

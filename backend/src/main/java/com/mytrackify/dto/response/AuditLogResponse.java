package com.mytrackify.dto.response;

import com.mytrackify.enums.AdminAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String adminEmail;
    private AdminAction action;
    private String targetType;
    private Long targetId;
    private String changeReason;
    private String endpoint;
    private String httpMethod;
    private String ipAddress;
    private LocalDateTime createdAt;
}

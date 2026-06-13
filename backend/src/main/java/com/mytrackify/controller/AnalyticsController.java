package com.mytrackify.controller;

import com.mytrackify.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * Analytics Controller — readiness calculator and stats endpoints.
 * Currently returns stub data; will be connected to AnalyticsEngine service.
 */
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReadiness(
            @RequestParam Long companyId) {
        // Stub response — will be implemented with MatchingService + AnalyticsEngine
        Map<String, Object> readiness = Map.of(
                "companyId", companyId,
                "message", "Analytics engine not yet connected to database",
                "status", "PENDING"
        );
        return ResponseEntity.ok(ApiResponse.success(readiness));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        // Stub response
        Map<String, Object> stats = Map.of(
                "totalApplications", 0,
                "totalOffers", 0,
                "successRate", 0.0,
                "message", "Connect database to see real statistics"
        );
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

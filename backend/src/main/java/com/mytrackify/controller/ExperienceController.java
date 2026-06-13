package com.mytrackify.controller;

import com.mytrackify.dto.request.LogExperienceRequest;
import com.mytrackify.dto.response.ApiResponse;
import com.mytrackify.entity.ApplicationJourney;
import com.mytrackify.entity.Student;
import com.mytrackify.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/experiences")
public class ExperienceController {

    private final InterviewService interviewService;

    public ExperienceController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<String>> logExperience(
            @AuthenticationPrincipal Student student,
            @Valid @RequestBody LogExperienceRequest request) {
        interviewService.logExperience(student.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Experience logged successfully",
                        "Thank you for sharing your interview experience!"));
    }
}

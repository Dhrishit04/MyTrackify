package com.mytrackify.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "College ID is required")
    private String collegeId;

    @NotNull(message = "Graduation year is required")
    @Min(value = 2020, message = "Invalid graduation year")
    @Max(value = 2030, message = "Invalid graduation year")
    private Integer graduationYear;

    @NotBlank(message = "Branch is required")
    private String branch;

    private String cgpaRange;
}

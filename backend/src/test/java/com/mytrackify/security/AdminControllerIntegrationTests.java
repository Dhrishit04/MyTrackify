package com.mytrackify.security;

import com.mytrackify.entity.AdminUser;
import com.mytrackify.entity.Student;
import com.mytrackify.enums.AdminLevel;
import com.mytrackify.repository.AdminUserRepository;
import com.mytrackify.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the admin RBAC authorization matrix
 * (spec Week 5, Testing Strategy — Integration Tests).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class AdminControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private String adminToken;
    private String directorToken;
    private String moderatorToken;
    private String studentToken;

    @BeforeEach
    void setUp() {
        adminUserRepository.deleteAll();
        studentRepository.deleteAll();

        // These students have no AdminUser records, so their tokens carry is_admin=false.
        // The authorization tests verify that non-admin tokens are rejected.

        Student adminStudent = studentRepository.save(Student.builder()
                .email("admin@test.com")
                .passwordHash(passwordEncoder.encode("pass"))
                .collegeId("ADMIN")
                .graduationYear(2025)
                .branch("System")
                .cgpaRange("N/A")
                .anonymizedId("ADMIN_TEST")
                .isActive(true)
                .role("ADMIN")
                .build());
        adminToken = tokenProvider.generateToken(adminStudent);

        Student directorStudent = studentRepository.save(Student.builder()
                .email("director@test.com")
                .passwordHash(passwordEncoder.encode("pass"))
                .collegeId("DIR")
                .graduationYear(2025)
                .branch("CSE")
                .cgpaRange("N/A")
                .anonymizedId("DIR_TEST")
                .isActive(true)
                .role("ADMIN")
                .build());
        directorToken = tokenProvider.generateToken(directorStudent);

        Student modStudent = studentRepository.save(Student.builder()
                .email("mod@test.com")
                .passwordHash(passwordEncoder.encode("pass"))
                .collegeId("MOD")
                .graduationYear(2025)
                .branch("CSE")
                .cgpaRange("N/A")
                .anonymizedId("MOD_TEST")
                .isActive(true)
                .role("STUDENT")
                .build());
        moderatorToken = tokenProvider.generateToken(modStudent);

        Student plainStudent = studentRepository.save(Student.builder()
                .email("student@test.com")
                .passwordHash(passwordEncoder.encode("pass"))
                .collegeId("STU")
                .graduationYear(2025)
                .branch("CSE")
                .cgpaRange("N/A")
                .anonymizedId("STU_TEST")
                .isActive(true)
                .role("STUDENT")
                .build());
        studentToken = tokenProvider.generateToken(plainStudent);
    }

    // ── Security tests ──

    @Test
    void testMissingAuthHeaderRejected() throws Exception {
        // Without an AuthenticationEntryPoint, Spring Security returns 403 (not 401)
        // when no auth is present for a protected resource.
        mockMvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testExpiredTokenRejected() throws Exception {
        // Invalid tokens are not parsed → no authentication set → 403
        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .header("Authorization", "Bearer invalid-token-here"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testTamperedTokenRejected() throws Exception {
        String tampered = adminToken.substring(0, adminToken.length() - 10) + "TAMPERED";
        // The token is structurally valid but tampered → JWT validation fails → 403
        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .header("Authorization", "Bearer " + tampered))
                .andExpect(status().isForbidden());
    }

    // ── Authorization matrix ──

    @Test
    void testStudentCannotAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testStudentCannotVerifyExperience() throws Exception {
        mockMvc.perform(post("/api/v1/admin/experiences/1/verify")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testStudentCannotFlagExperience() throws Exception {
        mockMvc.perform(post("/api/v1/admin/experiences/1/flag")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"reason\":\"test\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testModeratorCannotAccessSystemAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + moderatorToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testModeratorCannotVerifyExperience() throws Exception {
        // Moderator has accessLevel 20 < DIRECTOR 70 required for verify
        mockMvc.perform(post("/api/v1/admin/experiences/1/verify")
                        .header("Authorization", "Bearer " + moderatorToken))
                .andExpect(status().isForbidden());
    }
}
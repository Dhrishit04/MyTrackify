package com.mytrackify.service;

import com.mytrackify.dto.request.LoginRequest;
import com.mytrackify.dto.request.RegisterRequest;
import com.mytrackify.dto.response.AuthResponse;
import com.mytrackify.entity.AdminUser;
import com.mytrackify.entity.Student;
import com.mytrackify.exception.UnauthorizedException;
import com.mytrackify.repository.AdminUserRepository;
import com.mytrackify.repository.StudentRepository;
import com.mytrackify.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(StudentRepository studentRepository,
                       AdminUserRepository adminUserRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.studentRepository = studentRepository;
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Student student = Student.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .collegeId(request.getCollegeId())
                .graduationYear(request.getGraduationYear())
                .branch(request.getBranch())
                .cgpaRange(request.getCgpaRange())
                .isActive(true)
                .role("STUDENT")
                .build();

        student = studentRepository.save(student);

        String token = tokenProvider.generateToken(student);

        return AuthResponse.builder()
                .token(token)
                .refreshToken("refresh_" + System.currentTimeMillis())
                .tokenType("Bearer")
                .user(toStudentSummary(student))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), student.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(student);

        student.setLastLogin(java.time.LocalDateTime.now());
        studentRepository.save(student);

        return AuthResponse.builder()
                .token(token)
                .refreshToken("refresh_" + System.currentTimeMillis())
                .tokenType("Bearer")
                .user(toStudentSummary(student))
                .build();
    }

    private AuthResponse.StudentSummary toStudentSummary(Student student) {
        AuthResponse.StudentSummary.StudentSummaryBuilder builder = AuthResponse.StudentSummary.builder()
                .id(student.getId())
                .email(student.getEmail())
                .anonymizedId(student.getAnonymizedId())
                .branch(student.getBranch())
                .graduationYear(student.getGraduationYear())
                .cgpaRange(student.getCgpaRange())
                .role(student.getRole());

        adminUserRepository.findByStudentId(student.getId()).ifPresent(admin -> {
            if (admin.isAdmin()) {
                builder.isAdmin(true)
                        .adminLevel(admin.getAdminRole().getLevel().name())
                        .adminAccessLevel(admin.getAdminRole().getAccessLevel())
                        .scope(admin.getScope())
                        .permissions(new ArrayList<>(admin.getAdminRole().getPermissions()));
            }
        });

        return builder.build();
    }
}

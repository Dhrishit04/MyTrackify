package com.mytrackify.service;

import com.mytrackify.dto.request.LoginRequest;
import com.mytrackify.dto.request.RegisterRequest;
import com.mytrackify.dto.response.AuthResponse;
import com.mytrackify.entity.Student;
import com.mytrackify.exception.UnauthorizedException;
import com.mytrackify.repository.StudentRepository;
import com.mytrackify.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(StudentRepository studentRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.studentRepository = studentRepository;
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

        String token = tokenProvider.generateToken(student.getId(), student.getEmail(), student.getRole());

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

        String token = tokenProvider.generateToken(student.getId(), student.getEmail(), student.getRole());

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
        return AuthResponse.StudentSummary.builder()
                .id(student.getId())
                .email(student.getEmail())
                .anonymizedId(student.getAnonymizedId())
                .branch(student.getBranch())
                .graduationYear(student.getGraduationYear())
                .cgpaRange(student.getCgpaRange())
                .role(student.getRole())
                .build();
    }
}

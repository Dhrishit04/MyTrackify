package com.mytrackify.security;

import com.mytrackify.entity.AdminUser;
import com.mytrackify.repository.AdminUserRepository;
import com.mytrackify.repository.StudentRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final StudentRepository studentRepository;
    private final AdminUserRepository adminUserRepository;

    public JwtAuthFilter(JwtTokenProvider tokenProvider,
                        StudentRepository studentRepository,
                        AdminUserRepository adminUserRepository) {
        this.tokenProvider = tokenProvider;
        this.studentRepository = studentRepository;
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);

        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            Long userId = tokenProvider.getUserIdFromToken(token);

            studentRepository.findById(userId).ifPresent(student -> {
                String authority;
                Optional<AdminUser> adminUser = adminUserRepository.findByStudentId(userId);
                if (adminUser.isPresent() && adminUser.get().isAdmin()) {
                    authority = "ROLE_" + adminUser.get().getAdminRole().getLevel().name();
                } else {
                    authority = "ROLE_" + student.getRole();
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                student,
                                null,
                                List.of(new SimpleGrantedAuthority(authority))
                        );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            });
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}

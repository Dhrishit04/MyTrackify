package com.mytrackify.security;

import com.mytrackify.entity.AdminUser;
import com.mytrackify.entity.Student;
import com.mytrackify.repository.AdminUserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long jwtExpirationMs;
    private final AdminUserRepository adminUserRepository;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration-ms}") long jwtExpirationMs,
            AdminUserRepository adminUserRepository) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
        this.adminUserRepository = adminUserRepository;
    }

    /**
     * Builds a token for a student. If the student is an active admin, embeds
     * admin_level / access_level / permissions / scope so the frontend can drive
     * role-aware UI without extra calls. Otherwise marks is_admin=false.
     */
    public String generateToken(Student student) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        Map<String, Object> claims = new HashMap<>();
        claims.put("email", student.getEmail());
        claims.put("role", student.getRole());

        Optional<AdminUser> adminUser = adminUserRepository.findByStudentId(student.getId());
        if (adminUser.isPresent() && adminUser.get().isAdmin()) {
            AdminUser admin = adminUser.get();
            claims.put("is_admin", true);
            claims.put("admin_level", admin.getAdminRole().getLevel().name());
            claims.put("admin_access_level", admin.getAdminRole().getAccessLevel());
            claims.put("permissions", admin.getAdminRole().getPermissions());
            claims.put("scope", admin.getScope());
        } else {
            claims.put("is_admin", false);
        }

        return Jwts.builder()
                .subject(String.valueOf(student.getId()))
                .claims(claims)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}

package com.mytrackify.config;

import com.mytrackify.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/h2-console/**",
                    "/actuator/**",
                    "/error"
                ).permitAll()
                // Admin dashboard — coarse role gate; fine-grained checks live in @RequireAdminPermission
                .requestMatchers("/api/v1/admin/system/**", "/api/v1/admin/roles/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/admin/**")
                    .hasAnyAuthority("ROLE_SYSTEM_ADMIN", "ROLE_DIRECTOR", "ROLE_ASSOCIATE", "ROLE_MODERATOR")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/admin/**")
                    .hasAnyAuthority("ROLE_SYSTEM_ADMIN", "ROLE_DIRECTOR")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/v1/admin/**")
                    .hasAnyAuthority("ROLE_SYSTEM_ADMIN", "ROLE_DIRECTOR")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/admin/**")
                    .hasAuthority("ROLE_SYSTEM_ADMIN")
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // For H2 console
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

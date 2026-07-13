package com.mytrackify.config;

import com.mytrackify.entity.AdminRole;
import com.mytrackify.entity.AdminUser;
import com.mytrackify.entity.Company;
import com.mytrackify.entity.Student;
import com.mytrackify.enums.AdminLevel;
import com.mytrackify.repository.AdminRoleRepository;
import com.mytrackify.repository.AdminUserRepository;
import com.mytrackify.repository.CompanyRepository;
import com.mytrackify.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds sample company data AND the admin RBAC foundation
 * (4 default roles + a bootstrap SYSTEM_ADMIN).
 * Runs in both dev (H2) and prod (PostgreSQL) profiles.
 *
 * Bootstrap admin credentials are read from environment variables
 * (APP_BOOTSTRAP_ADMIN_EMAIL, APP_BOOTSTRAP_ADMIN_PASSWORD) — never hardcoded.
 */
@Configuration
@Profile({"dev", "prod"})
public class DataSeeder {

    // Bootstrap admin credentials — read from env vars, never hardcoded.
    @Value("${app.admin.bootstrap.email:}")
    private String bootstrapAdminEmail;

    @Value("${app.admin.bootstrap.password:}")
    private String bootstrapAdminPassword;

    @Value("${app.admin.backup.email:}")
    private String backupAdminEmail;

    @Value("${app.admin.backup.password:}")
    private String backupAdminPassword;

    @Bean
    @Transactional
    CommandLineRunner seedCompanies(CompanyRepository companyRepository) {
        return args -> {
            if (companyRepository.count() > 0) return;

            List<Company> companies = Arrays.asList(
                Company.builder().name("Google").sector("Product").headquartersLocation("Bangalore, India")
                    .website("https://careers.google.com").visitFrequency("Annual")
                    .typicalRoles("SDE,STEP Intern,ML Engineer").avgCtcRange("18-22 LPA")
                    .totalApplications(47).totalOffers(6).avgSuccessRate(new BigDecimal("12.70")).build(),
                Company.builder().name("Microsoft").sector("Product").headquartersLocation("Hyderabad, India")
                    .website("https://careers.microsoft.com").visitFrequency("Annual")
                    .typicalRoles("SDE,PM,Data Scientist").avgCtcRange("16-20 LPA")
                    .totalApplications(52).totalOffers(10).avgSuccessRate(new BigDecimal("19.20")).build(),
                Company.builder().name("Amazon").sector("Product").headquartersLocation("Bangalore, India")
                    .website("https://www.amazon.jobs").visitFrequency("Bi-Annual")
                    .typicalRoles("SDE,SDE Intern,Business Analyst").avgCtcRange("14-18 LPA")
                    .totalApplications(63).totalOffers(15).avgSuccessRate(new BigDecimal("23.80")).build(),
                Company.builder().name("Goldman Sachs").sector("Trading").headquartersLocation("Bangalore, India")
                    .website("https://www.goldmansachs.com/careers").visitFrequency("Annual")
                    .typicalRoles("Analyst,Engineering Analyst").avgCtcRange("20-28 LPA")
                    .totalApplications(38).totalOffers(5).avgSuccessRate(new BigDecimal("13.20")).build(),
                Company.builder().name("Flipkart").sector("Product").headquartersLocation("Bangalore, India")
                    .website("https://www.flipkartcareers.com").visitFrequency("Annual")
                    .typicalRoles("SDE,Data Analyst").avgCtcRange("14-17 LPA")
                    .totalApplications(45).totalOffers(12).avgSuccessRate(new BigDecimal("26.70")).build(),
                Company.builder().name("Deloitte").sector("Consulting").headquartersLocation("Mumbai, India")
                    .website("https://www2.deloitte.com/careers").visitFrequency("Bi-Annual")
                    .typicalRoles("Analyst,Consultant,Technology Analyst").avgCtcRange("8-12 LPA")
                    .totalApplications(72).totalOffers(25).avgSuccessRate(new BigDecimal("34.70")).build(),
                Company.builder().name("Infosys").sector("Service").headquartersLocation("Bangalore, India")
                    .website("https://www.infosys.com/careers").visitFrequency("Annual")
                    .typicalRoles("Systems Engineer,Specialist Programmer").avgCtcRange("4-8 LPA")
                    .totalApplications(120).totalOffers(65).avgSuccessRate(new BigDecimal("54.20")).build(),
                Company.builder().name("Adobe").sector("Product").headquartersLocation("Noida, India")
                    .website("https://www.adobe.com/careers").visitFrequency("Annual")
                    .typicalRoles("SDE,MTS,Research Engineer").avgCtcRange("18-25 LPA")
                    .totalApplications(35).totalOffers(4).avgSuccessRate(new BigDecimal("11.40")).build(),
                Company.builder().name("JP Morgan Chase").sector("Trading").headquartersLocation("Mumbai, India")
                    .website("https://careers.jpmorgan.com").visitFrequency("Annual")
                    .typicalRoles("Technology Analyst,Quant Analyst").avgCtcRange("15-22 LPA")
                    .totalApplications(42).totalOffers(8).avgSuccessRate(new BigDecimal("19.00")).build(),
                Company.builder().name("TCS").sector("Service").headquartersLocation("Mumbai, India")
                    .website("https://www.tcs.com/careers").visitFrequency("Annual")
                    .typicalRoles("Systems Engineer,Digital Specialist").avgCtcRange("3.5-7 LPA")
                    .totalApplications(150).totalOffers(90).avgSuccessRate(new BigDecimal("60.00")).build(),
                Company.builder().name("Uber").sector("Product").headquartersLocation("Hyderabad, India")
                    .website("https://www.uber.com/careers").visitFrequency("Once")
                    .typicalRoles("SDE-I,Backend Engineer").avgCtcRange("20-26 LPA")
                    .totalApplications(28).totalOffers(3).avgSuccessRate(new BigDecimal("10.70")).build(),
                Company.builder().name("Wipro").sector("Service").headquartersLocation("Bangalore, India")
                    .website("https://careers.wipro.com").visitFrequency("Annual")
                    .typicalRoles("Project Engineer,Turbo Engineer").avgCtcRange("3.5-6.5 LPA")
                    .totalApplications(130).totalOffers(78).avgSuccessRate(new BigDecimal("60.00")).build()
            );
            companyRepository.saveAll(companies);
            System.out.println("✅ Seeded " + companies.size() + " companies into database");
        };
    }

    @Bean
    @Transactional
    CommandLineRunner seedAdmin(AdminRoleRepository adminRoleRepository,
                                AdminUserRepository adminUserRepository,
                                StudentRepository studentRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            // 1) Ensure the 4 default roles exist (idempotent).
            for (AdminLevel level : AdminLevel.values()) {
                adminRoleRepository.findByLevel(level).ifPresentOrElse(
                        role -> {},
                        () -> adminRoleRepository.save(AdminRole.builder()
                                .level(level)
                                .roleName(level.getDisplayName())
                                .description(level.getDescription())
                                .accessLevel(level.getAccessLevel())
                                .permissions(level.getDefaultPermissions())
                                .build())
                );
            }

            // 2) Bootstrap SYSTEM_ADMIN only if env vars are set.
            if (bootstrapAdminEmail == null || bootstrapAdminEmail.isBlank()
                    || bootstrapAdminPassword == null || bootstrapAdminPassword.isBlank()) {
                System.out.println("ℹ️  Skipping bootstrap admin — set APP_BOOTSTRAP_ADMIN_EMAIL "
                        + "and APP_BOOTSTRAP_ADMIN_PASSWORD to create one.");
                return;
            }

            AdminRole systemAdminRole = adminRoleRepository.findByLevel(AdminLevel.SYSTEM_ADMIN)
                    .orElseThrow(() -> new IllegalStateException("SYSTEM_ADMIN role missing after seeding"));

            // Check if an admin user with this email already exists
            Student adminStudent = studentRepository.findByEmail(bootstrapAdminEmail).orElse(null);
            if (adminStudent == null) {
                // Also check for any existing student with role ADMIN
                adminStudent = studentRepository.findByRole("ADMIN").stream().findFirst().orElse(null);
            }
            if (adminStudent == null) {
                // Create bootstrap admin student from env-var credentials (only on first run)
                adminStudent = studentRepository.save(Student.builder()
                        .email(bootstrapAdminEmail)
                        .passwordHash(passwordEncoder.encode(bootstrapAdminPassword))
                        .collegeId("ADMIN")
                        .graduationYear(2025)
                        .branch("System")
                        .cgpaRange("N/A")
                        .anonymizedId("ADMIN_" + System.nanoTime())
                        .isActive(true)
                        .role("ADMIN")
                        .build());
                System.out.println("⚠️  Created bootstrap SYSTEM_ADMIN: " + bootstrapAdminEmail
                        + " — change password after first login!");
            }

            if (adminUserRepository.findByStudentId(adminStudent.getId()).isEmpty()) {
                adminUserRepository.save(AdminUser.builder()
                        .student(adminStudent)
                        .adminRole(systemAdminRole)
                        .scope("ALL")
                        .isActive(true)
                        .build());
                System.out.println("✅ Assigned SYSTEM_ADMIN to " + adminStudent.getEmail());
            }

            // 3) Backup SYSTEM_ADMIN (optional, from env vars).
            if (backupAdminEmail != null && !backupAdminEmail.isBlank()
                    && backupAdminPassword != null && !backupAdminPassword.isBlank()) {
                Student backupStudent = studentRepository.findByEmail(backupAdminEmail).orElse(null);
                if (backupStudent == null) {
                    backupStudent = studentRepository.save(Student.builder()
                            .email(backupAdminEmail)
                            .passwordHash(passwordEncoder.encode(backupAdminPassword))
                            .collegeId("BACKUP")
                            .graduationYear(2025)
                            .branch("System")
                            .cgpaRange("N/A")
                            .anonymizedId("BACKUP_" + System.nanoTime())
                            .isActive(true)
                            .role("ADMIN")
                            .build());
                    System.out.println("⚠️  Created backup SYSTEM_ADMIN: " + backupAdminEmail);
                }
                if (adminUserRepository.findByStudentId(backupStudent.getId()).isEmpty()) {
                    adminUserRepository.save(AdminUser.builder()
                            .student(backupStudent)
                            .adminRole(systemAdminRole)
                            .scope("ALL")
                            .isActive(true)
                            .build());
                    System.out.println("✅ Assigned backup SYSTEM_ADMIN to " + backupStudent.getEmail());
                }
            }
        };
    }
}
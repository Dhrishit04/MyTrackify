package com.mytrackify.config;

import com.mytrackify.entity.Company;
import com.mytrackify.repository.CompanyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import java.math.BigDecimal;

/**
 * Seeds the database with sample company data.
 * Runs in both dev (H2) and prod (PostgreSQL) profiles.
 * Skips seeding if companies already exist.
 */
@Configuration
@Profile({"dev", "prod"})
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(CompanyRepository companyRepository) {
        return args -> {
            if (companyRepository.count() > 0) return;

            companyRepository.save(Company.builder()
                    .name("Google").sector("Product").headquartersLocation("Bangalore, India")
                    .website("https://careers.google.com").visitFrequency("Annual")
                    .typicalRoles("SDE,STEP Intern,ML Engineer").avgCtcRange("18-22 LPA")
                    .totalApplications(47).totalOffers(6).avgSuccessRate(new BigDecimal("12.70")).build());

            companyRepository.save(Company.builder()
                    .name("Microsoft").sector("Product").headquartersLocation("Hyderabad, India")
                    .website("https://careers.microsoft.com").visitFrequency("Annual")
                    .typicalRoles("SDE,PM,Data Scientist").avgCtcRange("16-20 LPA")
                    .totalApplications(52).totalOffers(10).avgSuccessRate(new BigDecimal("19.20")).build());

            companyRepository.save(Company.builder()
                    .name("Amazon").sector("Product").headquartersLocation("Bangalore, India")
                    .website("https://www.amazon.jobs").visitFrequency("Bi-Annual")
                    .typicalRoles("SDE,SDE Intern,Business Analyst").avgCtcRange("14-18 LPA")
                    .totalApplications(63).totalOffers(15).avgSuccessRate(new BigDecimal("23.80")).build());

            companyRepository.save(Company.builder()
                    .name("Goldman Sachs").sector("Trading").headquartersLocation("Bangalore, India")
                    .website("https://www.goldmansachs.com/careers").visitFrequency("Annual")
                    .typicalRoles("Analyst,Engineering Analyst").avgCtcRange("20-28 LPA")
                    .totalApplications(38).totalOffers(5).avgSuccessRate(new BigDecimal("13.20")).build());

            companyRepository.save(Company.builder()
                    .name("Flipkart").sector("Product").headquartersLocation("Bangalore, India")
                    .website("https://www.flipkartcareers.com").visitFrequency("Annual")
                    .typicalRoles("SDE,Data Analyst").avgCtcRange("14-17 LPA")
                    .totalApplications(45).totalOffers(12).avgSuccessRate(new BigDecimal("26.70")).build());

            companyRepository.save(Company.builder()
                    .name("Deloitte").sector("Consulting").headquartersLocation("Mumbai, India")
                    .website("https://www2.deloitte.com/careers").visitFrequency("Bi-Annual")
                    .typicalRoles("Analyst,Consultant,Technology Analyst").avgCtcRange("8-12 LPA")
                    .totalApplications(72).totalOffers(25).avgSuccessRate(new BigDecimal("34.70")).build());

            companyRepository.save(Company.builder()
                    .name("Infosys").sector("Service").headquartersLocation("Bangalore, India")
                    .website("https://www.infosys.com/careers").visitFrequency("Annual")
                    .typicalRoles("Systems Engineer,Specialist Programmer").avgCtcRange("4-8 LPA")
                    .totalApplications(120).totalOffers(65).avgSuccessRate(new BigDecimal("54.20")).build());

            companyRepository.save(Company.builder()
                    .name("Adobe").sector("Product").headquartersLocation("Noida, India")
                    .website("https://www.adobe.com/careers").visitFrequency("Annual")
                    .typicalRoles("SDE,MTS,Research Engineer").avgCtcRange("18-25 LPA")
                    .totalApplications(35).totalOffers(4).avgSuccessRate(new BigDecimal("11.40")).build());

            companyRepository.save(Company.builder()
                    .name("JP Morgan Chase").sector("Trading").headquartersLocation("Mumbai, India")
                    .website("https://careers.jpmorgan.com").visitFrequency("Annual")
                    .typicalRoles("Technology Analyst,Quant Analyst").avgCtcRange("15-22 LPA")
                    .totalApplications(42).totalOffers(8).avgSuccessRate(new BigDecimal("19.00")).build());

            companyRepository.save(Company.builder()
                    .name("TCS").sector("Service").headquartersLocation("Mumbai, India")
                    .website("https://www.tcs.com/careers").visitFrequency("Annual")
                    .typicalRoles("Systems Engineer,Digital Specialist").avgCtcRange("3.5-7 LPA")
                    .totalApplications(150).totalOffers(90).avgSuccessRate(new BigDecimal("60.00")).build());

            companyRepository.save(Company.builder()
                    .name("Uber").sector("Product").headquartersLocation("Hyderabad, India")
                    .website("https://www.uber.com/careers").visitFrequency("Once")
                    .typicalRoles("SDE-I,Backend Engineer").avgCtcRange("20-26 LPA")
                    .totalApplications(28).totalOffers(3).avgSuccessRate(new BigDecimal("10.70")).build());

            companyRepository.save(Company.builder()
                    .name("Wipro").sector("Service").headquartersLocation("Bangalore, India")
                    .website("https://careers.wipro.com").visitFrequency("Annual")
                    .typicalRoles("Project Engineer,Turbo Engineer").avgCtcRange("3.5-6.5 LPA")
                    .totalApplications(130).totalOffers(78).avgSuccessRate(new BigDecimal("60.00")).build());

            System.out.println("✅ Seeded " + companyRepository.count() + " companies into database");
        };
    }
}

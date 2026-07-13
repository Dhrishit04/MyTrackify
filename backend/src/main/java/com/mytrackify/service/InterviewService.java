package com.mytrackify.service;

import com.mytrackify.dto.request.LogExperienceRequest;
import com.mytrackify.entity.*;
import com.mytrackify.exception.ResourceNotFoundException;
import com.mytrackify.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final ApplicationJourneyRepository journeyRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final InterviewExperienceRepository experienceRepository;
    private final InterviewProcessRepository processRepository;

    public InterviewService(ApplicationJourneyRepository journeyRepository,
                           StudentRepository studentRepository,
                           CompanyRepository companyRepository,
                           InterviewExperienceRepository experienceRepository,
                           InterviewProcessRepository processRepository) {
        this.journeyRepository = journeyRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.experienceRepository = experienceRepository;
        this.processRepository = processRepository;
    }

    @Transactional
    public ApplicationJourney logExperience(Long studentId, LogExperienceRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        ApplicationJourney journey = ApplicationJourney.builder()
                .student(student)
                .applicationType(request.getApplicationType())
                .applicationDate(LocalDate.parse(request.getApplicationDate()))
                .finalOutcome(request.getFinalOutcome())
                .build();

        // Create round attempts and experiences
        for (LogExperienceRequest.RoundData roundData : request.getRounds()) {
            RoundAttempt attempt = RoundAttempt.builder()
                    .journey(journey)
                    .roundNumber(roundData.getRoundNumber())
                    .roundType(roundData.getRoundType())
                    .outcome(roundData.getOutcome())
                    .difficultyPerceived(roundData.getDifficulty())
                    .build();

            InterviewExperience experience = InterviewExperience.builder()
                    .attempt(attempt)
                    .questionsAsked(roundData.getQuestionsAsked())
                    .topics(String.join(",", roundData.getTopics()))
                    .preparationTips(roundData.getPreparationTips())
                    .difficultyRating(roundData.getDifficulty())
                    .build();

            attempt.setExperience(experience);
            journey.getRoundAttempts().add(attempt);
        }

        return journeyRepository.save(journey);
    }

    @Transactional
    public InterviewExperience markAsVerified(Long experienceId) {
        InterviewExperience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found: " + experienceId));
        experience.setVerified(true);
        return experienceRepository.save(experience);
    }

    @Transactional
    public InterviewExperience flagExperience(Long experienceId, String reason) {
        InterviewExperience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found: " + experienceId));
        experience.setFlagged(true);
        experience.setFlagReason(reason);
        return experienceRepository.save(experience);
    }

    @Transactional
    public InterviewExperience requestRevision(Long experienceId, String note) {
        InterviewExperience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found: " + experienceId));
        experience.setRevisionRequested(true);
        experience.setRevisionNote(note);
        return experienceRepository.save(experience);
    }

    public Page<InterviewExperience> getFlaggedExperiences(Pageable pageable) {
        return experienceRepository.findByFlaggedTrue(pageable);
    }

    @Transactional
    public InterviewProcess verifyProcess(Long processId) {
        InterviewProcess process = processRepository.findById(processId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview process not found: " + processId));
        process.setLastVerifiedAt(LocalDateTime.now());
        if (process.getVerifiedCount() == null) {
            process.setVerifiedCount(1);
        } else {
            process.setVerifiedCount(process.getVerifiedCount() + 1);
        }
        return processRepository.save(process);
    }

    @Transactional
    public InterviewExperience mergeExperiences(Long primaryId, List<Long> duplicateIds) {
        InterviewExperience primary = experienceRepository.findById(primaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Primary experience not found: " + primaryId));

        int totalHelpful = primary.getHelpfulCount() != null ? primary.getHelpfulCount() : 0;
        for (Long dupId : duplicateIds) {
            InterviewExperience dup = experienceRepository.findById(dupId)
                    .orElseThrow(() -> new ResourceNotFoundException("Duplicate experience not found: " + dupId));
            totalHelpful += dup.getHelpfulCount() != null ? dup.getHelpfulCount() : 0;
            dup.setMergedIntoId(primaryId);
            dup.setFlagged(true);
            dup.setFlagReason("Merged into experience #" + primaryId);
            experienceRepository.save(dup);
        }
        primary.setHelpfulCount(totalHelpful);
        return experienceRepository.save(primary);
    }

    @Transactional
    public InterviewExperience suggestTags(Long experienceId, List<String> tags) {
        InterviewExperience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found: " + experienceId));
        String existing = experience.getSuggestedTags();
        String newTags = String.join(",", tags);
        experience.setSuggestedTags(existing != null && !existing.isBlank()
                ? existing + "," + newTags : newTags);
        return experienceRepository.save(experience);
    }

    /** Helper: extract company name from an ApplicationJourney via process → company. */
    private String companyName(ApplicationJourney j) {
        try {
            if (j.getProcess() != null && j.getProcess().getCompany() != null) {
                return j.getProcess().getCompany().getName();
            }
        } catch (Exception ignored) {}
        return "Unknown";
    }

    /** Aggregate placement report — counts from the journey table. */
    @Transactional(readOnly = true)
    public Map<String, Object> getPlacementReport() {
        List<ApplicationJourney> all = journeyRepository.findAll();
        long totalApplications = all.size();
        long totalOffers = all.stream().filter(j -> "Selected".equals(j.getFinalOutcome())).count();
        double successRate = totalApplications > 0 ? (double) totalOffers / totalApplications * 100 : 0;

        // Per-company breakdown
        Map<String, long[]> byCompany = new LinkedHashMap<>();
        for (ApplicationJourney j : all) {
            String name = companyName(j);
            byCompany.computeIfAbsent(name, k -> new long[2]);
            byCompany.get(name)[0]++; // apps
            if ("Selected".equals(j.getFinalOutcome())) byCompany.get(name)[1]++; // offers
        }

        List<Map<String, Object>> breakdown = byCompany.entrySet().stream().map(e -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("company", e.getKey());
            row.put("applications", e.getValue()[0]);
            row.put("offers", e.getValue()[1]);
            row.put("successRate", e.getValue()[0] > 0
                    ? Math.round((double) e.getValue()[1] / e.getValue()[0] * 10000) / 100.0 : 0);
            return row;
        }).collect(Collectors.toList());

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalApplications", totalApplications);
        report.put("totalOffers", totalOffers);
        report.put("successRate", Math.round(successRate * 100.0) / 100.0);
        report.put("byCompany", breakdown);
        return report;
    }

    /** Per-company placement progress for the analytics dashboard. */
    @Transactional(readOnly = true)
    public Map<String, Object> getPlacementProgress() {
        List<ApplicationJourney> all = journeyRepository.findAll();
        long placed = all.stream().filter(j -> "Selected".equals(j.getFinalOutcome())).count();
        long totalStudents = studentRepository.count();

        // Group by company
        Map<String, Long> offersByCompany = all.stream()
                .filter(j -> "Selected".equals(j.getFinalOutcome()))
                .collect(Collectors.groupingBy(this::companyName, Collectors.counting()));

        Map<String, Object> progress = new LinkedHashMap<>();
        progress.put("totalStudents", totalStudents);
        progress.put("studentsPlaced", placed);
        progress.put("placementRate", totalStudents > 0
                ? Math.round((double) placed / totalStudents * 10000) / 100.0 : 0);
        progress.put("offersByCompany", offersByCompany);
        progress.put("totalOffers", all.stream().filter(j -> "Selected".equals(j.getFinalOutcome())).count());
        progress.put("totalApplications", (long) all.size());
        return progress;
    }
}

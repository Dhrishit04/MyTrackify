package com.mytrackify.service;

import com.mytrackify.dto.request.LogExperienceRequest;
import com.mytrackify.entity.*;
import com.mytrackify.exception.ResourceNotFoundException;
import com.mytrackify.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
public class InterviewService {

    private final ApplicationJourneyRepository journeyRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    public InterviewService(ApplicationJourneyRepository journeyRepository,
                           StudentRepository studentRepository,
                           CompanyRepository companyRepository) {
        this.journeyRepository = journeyRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
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
}

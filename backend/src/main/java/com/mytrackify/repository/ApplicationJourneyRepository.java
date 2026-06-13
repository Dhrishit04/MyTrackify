package com.mytrackify.repository;

import com.mytrackify.entity.ApplicationJourney;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationJourneyRepository extends JpaRepository<ApplicationJourney, Long> {
    List<ApplicationJourney> findByStudentIdOrderByApplicationDateDesc(Long studentId);
    List<ApplicationJourney> findByProcess_Company_IdOrderByApplicationDateDesc(Long companyId);
    long countByProcess_Company_IdAndFinalOutcome(Long companyId, String outcome);
}

package com.mytrackify.repository;

import com.mytrackify.entity.InterviewExperience;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewExperienceRepository extends JpaRepository<InterviewExperience, Long> {

    @Query("SELECT ie FROM InterviewExperience ie " +
           "JOIN ie.attempt ra " +
           "JOIN ra.journey aj " +
           "JOIN aj.process ip " +
           "WHERE ip.company.id = :companyId " +
           "ORDER BY ie.createdAt DESC")
    Page<InterviewExperience> findByCompanyId(Long companyId, Pageable pageable);

    Page<InterviewExperience> findByFlaggedTrue(Pageable pageable);

    long countByVerifiedFalse();
}

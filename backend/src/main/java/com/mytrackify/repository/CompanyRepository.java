package com.mytrackify.repository;

import com.mytrackify.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByNameContainingIgnoreCase(String name);

    @Query("SELECT c FROM Company c WHERE (:sector IS NULL OR c.sector = :sector)")
    Page<Company> findBySectorOptional(String sector, Pageable pageable);

    List<Company> findBySectorIgnoreCase(String sector);
}

package com.mytrackify.repository;

import com.mytrackify.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByAnonymizedId(String anonymizedId);
    boolean existsByEmail(String email);
    List<Student> findByRole(String role);
    long countByIsActiveTrue();
}

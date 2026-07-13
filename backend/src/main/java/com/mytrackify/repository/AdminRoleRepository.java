package com.mytrackify.repository;

import com.mytrackify.entity.AdminRole;
import com.mytrackify.enums.AdminLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRoleRepository extends JpaRepository<AdminRole, Long> {
    Optional<AdminRole> findByLevel(AdminLevel level);
}

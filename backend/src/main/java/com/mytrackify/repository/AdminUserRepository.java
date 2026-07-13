package com.mytrackify.repository;

import com.mytrackify.entity.AdminUser;
import com.mytrackify.enums.AdminLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByStudentId(Long studentId);

    List<AdminUser> findByAdminRoleLevel(AdminLevel level);

    List<AdminUser> findByIsActiveTrue();
}

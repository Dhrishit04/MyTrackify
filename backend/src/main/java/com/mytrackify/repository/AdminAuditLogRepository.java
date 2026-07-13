package com.mytrackify.repository;

import com.mytrackify.entity.AdminAuditLog;
import com.mytrackify.enums.AdminAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {
    Page<AdminAuditLog> findByAction(AdminAction action, Pageable pageable);

    Page<AdminAuditLog> findByAdminUserStudentEmail(String email, Pageable pageable);

    List<AdminAuditLog> findByAdminUserId(Long adminUserId);
}

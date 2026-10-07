package com.example.teamora.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.entity.Project;
import com.example.teamora.entity.User;
import com.example.teamora.enums.ProjectStatus;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByAssignedTeamLeaderId(Long teamLeaderId);

    long countByStatus(ProjectStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE Project p SET p.assignedTeamLeader = null WHERE p.assignedTeamLeader.id = :userId")
    void clearAssignedTeamLeader(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Project p SET p.createdBy = :fallbackAdmin WHERE p.createdBy.id = :userId")
    void reassignCreatedProjects(@Param("userId") Long userId, @Param("fallbackAdmin") User fallbackAdmin);
}

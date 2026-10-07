package com.example.teamora.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.entity.Task;
import com.example.teamora.entity.User;
import com.example.teamora.enums.TaskStatus;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssignedMemberId(Long memberId);

    List<Task> findByCreatedById(Long createdById);

    @Query("SELECT t FROM Task t WHERE t.project.assignedTeamLeader.id = :tlId")
    List<Task> findByTeamLeaderId(@Param("tlId") Long tlId);

    long countByStatus(TaskStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE Task t SET t.assignedMember = null WHERE t.assignedMember.id = :userId")
    void unassignTasksForUser(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Task t SET t.createdBy = :fallbackAdmin WHERE t.createdBy.id = :userId")
    void reassignCreatedTasks(@Param("userId") Long userId, @Param("fallbackAdmin") User fallbackAdmin);
}
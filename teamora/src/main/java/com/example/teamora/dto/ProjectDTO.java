package com.example.teamora.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.example.teamora.enums.Priority;
import com.example.teamora.enums.ProjectStatus;

public class ProjectDTO {

    private Long id;
    private String projectName;
    private String description;
    private Priority priority;
    private ProjectStatus status;
    private LocalDate deadline;
    private Long assignedTeamLeaderId;
    private String assignedTeamLeaderName;
    private Long createdById;
    private int totalTasks;
    private int completedTasks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Long getAssignedTeamLeaderId() {
        return assignedTeamLeaderId;
    }

    public void setAssignedTeamLeaderId(Long assignedTeamLeaderId) {
        this.assignedTeamLeaderId = assignedTeamLeaderId;
    }

    public String getAssignedTeamLeaderName() {
        return assignedTeamLeaderName;
    }

    public void setAssignedTeamLeaderName(String assignedTeamLeaderName) {
        this.assignedTeamLeaderName = assignedTeamLeaderName;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public int getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(int totalTasks) {
        this.totalTasks = totalTasks;
    }

    public int getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(int completedTasks) {
        this.completedTasks = completedTasks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

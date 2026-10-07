package com.example.teamora.dto;

import java.time.LocalDate;
import com.example.teamora.enums.Priority;
import com.example.teamora.enums.ProjectStatus;

public class ProjectRequest {

    private String projectName;
    private String description;
    private Priority priority;
    private ProjectStatus status;
    private LocalDate deadline;
    private Long assignedTeamLeaderId;

    public ProjectRequest() {
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
}

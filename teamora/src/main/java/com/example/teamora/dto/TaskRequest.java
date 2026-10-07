package com.example.teamora.dto;

import java.time.LocalDate;
import com.example.teamora.enums.Priority;
import com.example.teamora.enums.TaskStatus;

public class TaskRequest {

    private String title;
    private String description;
    private Priority priority;
    private TaskStatus status;
    private LocalDate deadline;
    private Long projectId;
    private Long assignedMemberId;

    public TaskRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getAssignedMemberId() {
        return assignedMemberId;
    }

    public void setAssignedMemberId(Long assignedMemberId) {
        this.assignedMemberId = assignedMemberId;
    }
}
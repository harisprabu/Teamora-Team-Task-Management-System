package com.example.teamora.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DailyFeedbackDTO {

    private Long id;
    private Long memberId;
    private String memberName;
    private LocalDate date;
    private String workCompleted;
    private Integer progress;
    private String issues;
    private String nextPlan;
    private LocalDateTime createdAt;

    public DailyFeedbackDTO() {
    }

    public DailyFeedbackDTO(Long id, Long memberId, String memberName, LocalDate date, String workCompleted,
                            Integer progress, String issues, String nextPlan, LocalDateTime createdAt) {
        this.id = id;
        this.memberId = memberId;
        this.memberName = memberName;
        this.date = date;
        this.workCompleted = workCompleted;
        this.progress = progress;
        this.issues = issues;
        this.nextPlan = nextPlan;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getWorkCompleted() {
        return workCompleted;
    }

    public void setWorkCompleted(String workCompleted) {
        this.workCompleted = workCompleted;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public String getIssues() {
        return issues;
    }

    public void setIssues(String issues) {
        this.issues = issues;
    }

    public String getNextPlan() {
        return nextPlan;
    }

    public void setNextPlan(String nextPlan) {
        this.nextPlan = nextPlan;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

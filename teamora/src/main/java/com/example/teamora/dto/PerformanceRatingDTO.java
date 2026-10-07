package com.example.teamora.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PerformanceRatingDTO {

    private Long id;
    private Long memberId;
    private String memberName;
    private Long teamLeaderId;
    private String teamLeaderName;
    private Integer rating;
    private String feedback;
    private LocalDate date;
    private LocalDateTime createdAt;

    public PerformanceRatingDTO() {
    }

    public PerformanceRatingDTO(Long id, Long memberId, String memberName, Long teamLeaderId,
                                String teamLeaderName, Integer rating, String feedback, LocalDate date, LocalDateTime createdAt) {
        this.id = id;
        this.memberId = memberId;
        this.memberName = memberName;
        this.teamLeaderId = teamLeaderId;
        this.teamLeaderName = teamLeaderName;
        this.rating = rating;
        this.feedback = feedback;
        this.date = date;
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

    public Long getTeamLeaderId() {
        return teamLeaderId;
    }

    public void setTeamLeaderId(Long teamLeaderId) {
        this.teamLeaderId = teamLeaderId;
    }

    public String getTeamLeaderName() {
        return teamLeaderName;
    }

    public void setTeamLeaderName(String teamLeaderName) {
        this.teamLeaderName = teamLeaderName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

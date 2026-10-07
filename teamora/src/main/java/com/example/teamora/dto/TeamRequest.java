package com.example.teamora.dto;

public class TeamRequest {

    private String teamName;
    private String description;
    private Long teamLeaderId;

    public TeamRequest() {
    }

    public TeamRequest(String teamName, String description, Long teamLeaderId) {
        this.teamName = teamName;
        this.description = description;
        this.teamLeaderId = teamLeaderId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getTeamLeaderId() {
        return teamLeaderId;
    }

    public void setTeamLeaderId(Long teamLeaderId) {
        this.teamLeaderId = teamLeaderId;
    }
}
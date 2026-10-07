package com.example.teamora.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.teamora.dto.DailyFeedbackDTO;
import com.example.teamora.dto.NotificationDTO;
import com.example.teamora.dto.PerformanceRatingDTO;
import com.example.teamora.dto.ProjectDTO;
import com.example.teamora.dto.TaskDTO;
import com.example.teamora.dto.TaskRequest;
import com.example.teamora.dto.TeamDTO;
import com.example.teamora.dto.UserDTO;
import com.example.teamora.entity.User;
import com.example.teamora.service.NotificationService;
import com.example.teamora.service.TeamLeaderService;

@RestController
@RequestMapping("/api/team-leader")
public class TeamLeaderController {

    private final TeamLeaderService teamLeaderService;
    private final NotificationService notificationService;

    public TeamLeaderController(TeamLeaderService teamLeaderService, NotificationService notificationService) {
        this.teamLeaderService = teamLeaderService;
        this.notificationService = notificationService;
    }

    // ==========================================
    // 1. PROJECTS & TEAMS
    // ==========================================
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getAssignedProjects(@AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.getAssignedProjects(leader));
    }

    @GetMapping("/team")
    public ResponseEntity<TeamDTO> getAssignedTeam(@AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.getAssignedTeam(leader));
    }

    @GetMapping("/members")
    public ResponseEntity<List<UserDTO>> getTeamMembers(@AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.getTeamMembers(leader));
    }

    // ==========================================
    // 2. TASK MANAGEMENT
    // ==========================================
    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDTO>> getLeaderTasks(@AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.getLeaderTasks(leader));
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskDTO> createTask(
            @RequestBody TaskRequest request,
            @AuthenticationPrincipal User leader) {
        return new ResponseEntity<>(teamLeaderService.createTask(request, leader), HttpStatus.CREATED);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskRequest request,
            @AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.updateTask(taskId, request, leader));
    }

    @PutMapping("/tasks/{taskId}/assign/{memberId}")
    public ResponseEntity<TaskDTO> assignTask(
            @PathVariable Long taskId,
            @PathVariable Long memberId,
            @AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.assignTaskToMember(taskId, memberId, leader));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Map<String, String>> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User leader) {
        teamLeaderService.deleteTask(taskId, leader);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }

    // ==========================================
    // 3. PROGRESS & ANALYTICS
    // ==========================================
    @GetMapping("/progress")
    public ResponseEntity<Map<String, Object>> getTeamProgress(@AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.getTeamProgress(leader));
    }

    // ==========================================
    // 4. DAILY FEEDBACK REVIEW
    // ==========================================
    @GetMapping("/feedback")
    public ResponseEntity<List<DailyFeedbackDTO>> getTeamDailyFeedback(@AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.getTeamDailyFeedback(leader));
    }

    // ==========================================
    // 5. MEMBER PERFORMANCE
    // ==========================================
    @PostMapping("/performance")
    public ResponseEntity<PerformanceRatingDTO> rateMember(
            @RequestBody PerformanceRatingDTO dto,
            @AuthenticationPrincipal User leader) {
        return new ResponseEntity<>(teamLeaderService.rateMember(dto, leader), HttpStatus.CREATED);
    }

    @GetMapping("/performance/{memberId}")
    public ResponseEntity<List<PerformanceRatingDTO>> getMemberPerformanceHistory(
            @PathVariable Long memberId,
            @AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(teamLeaderService.getMemberPerformanceHistory(memberId, leader));
    }

    // ==========================================
    // 6. NOTIFICATIONS
    // ==========================================
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@AuthenticationPrincipal User leader) {
        return ResponseEntity.ok(notificationService.getUserNotifications(leader.getId()));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Map<String, String>> markNotificationRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }
}

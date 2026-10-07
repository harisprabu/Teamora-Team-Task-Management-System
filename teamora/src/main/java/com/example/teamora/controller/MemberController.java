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
import com.example.teamora.dto.TaskCommentDTO;
import com.example.teamora.dto.TaskDTO;
import com.example.teamora.dto.TeamDTO;
import com.example.teamora.entity.User;
import com.example.teamora.enums.TaskStatus;
import com.example.teamora.service.MemberService;
import com.example.teamora.service.NotificationService;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;
    private final NotificationService notificationService;

    public MemberController(MemberService memberService, NotificationService notificationService) {
        this.memberService = memberService;
        this.notificationService = notificationService;
    }

    // ==========================================
    // 1. DASHBOARD
    // ==========================================
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.getDashboardStats(member));
    }

    // ==========================================
    // 2. TASKS
    // ==========================================
    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDTO>> getMyTasks(@AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.getMyTasks(member));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDTO> getTaskById(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.getTaskById(member, taskId));
    }

    @PutMapping("/tasks/{taskId}/start")
    public ResponseEntity<TaskDTO> startTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.startTask(member, taskId));
    }

    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<TaskDTO> completeTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.completeTask(member, taskId));
    }

    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.updateTaskStatus(member, taskId, status));
    }

    // ==========================================
    // 3. TASK COMMENTS
    // ==========================================
    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<List<TaskCommentDTO>> getTaskComments(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.getTaskComments(member, taskId));
    }

    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<TaskCommentDTO> addComment(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> requestBody,
            @AuthenticationPrincipal User member) {
        String comment = requestBody.get("comment");
        return new ResponseEntity<>(memberService.addComment(member, taskId, comment), HttpStatus.CREATED);
    }

    // ==========================================
    // 4. DAILY FEEDBACK
    // ==========================================
    @PostMapping("/daily-feedback")
    public ResponseEntity<DailyFeedbackDTO> submitDailyFeedback(
            @RequestBody DailyFeedbackDTO dto,
            @AuthenticationPrincipal User member) {
        return new ResponseEntity<>(memberService.submitDailyFeedback(member, dto), HttpStatus.CREATED);
    }

    @GetMapping("/daily-feedback")
    public ResponseEntity<List<DailyFeedbackDTO>> getMyDailyFeedbacks(@AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.getMyDailyFeedbackHistory(member));
    }

    // ==========================================
    // 5. TEAM & PERFORMANCE
    // ==========================================
    @GetMapping("/team")
    public ResponseEntity<TeamDTO> getMyTeam(@AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.getMyTeam(member));
    }

    @GetMapping("/performance")
    public ResponseEntity<List<PerformanceRatingDTO>> getMyPerformanceRatings(@AuthenticationPrincipal User member) {
        return ResponseEntity.ok(memberService.getMyPerformanceRatings(member));
    }

    // ==========================================
    // 6. NOTIFICATIONS
    // ==========================================
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@AuthenticationPrincipal User member) {
        return ResponseEntity.ok(notificationService.getUserNotifications(member.getId()));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Map<String, String>> markNotificationRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }
}

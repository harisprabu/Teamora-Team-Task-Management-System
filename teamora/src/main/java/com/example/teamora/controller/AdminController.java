package com.example.teamora.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.teamora.dto.ProjectDTO;
import com.example.teamora.dto.ProjectRequest;
import com.example.teamora.dto.TeamDTO;
import com.example.teamora.dto.TeamRequest;
import com.example.teamora.dto.UserDTO;
import com.example.teamora.entity.User;
import com.example.teamora.enums.Role;
import com.example.teamora.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==========================================
    // 1. DASHBOARD
    // ==========================================
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(adminService.getAdminDashboardStats());
    }

    // ==========================================
    // 2. USER MANAGEMENT
    // ==========================================
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/approve")
    public ResponseEntity<UserDTO> approveUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.approveUser(userId));
    }

    @PutMapping("/users/{userId}/reject")
    public ResponseEntity<UserDTO> rejectUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.rejectUser(userId));
    }

    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<UserDTO> deactivateUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(adminService.deactivateUser(userId, reason));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role role) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, role));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // ==========================================
    // 3. TEAM MANAGEMENT
    // ==========================================
    @GetMapping("/teams")
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(adminService.getAllTeams());
    }

    @PostMapping("/teams")
    public ResponseEntity<TeamDTO> createTeam(
            @RequestBody TeamRequest request,
            @AuthenticationPrincipal User admin) {
        return new ResponseEntity<>(adminService.createTeam(request, admin), HttpStatus.CREATED);
    }

    @PutMapping("/teams/{teamId}")
    public ResponseEntity<TeamDTO> updateTeam(
            @PathVariable Long teamId,
            @RequestBody TeamRequest request) {
        return ResponseEntity.ok(adminService.updateTeam(teamId, request));
    }

    @DeleteMapping("/teams/{teamId}")
    public ResponseEntity<Map<String, String>> deleteTeam(@PathVariable Long teamId) {
        adminService.deleteTeam(teamId);
        return ResponseEntity.ok(Map.of("message", "Team deleted successfully"));
    }

    @PostMapping("/teams/{teamId}/members/{userId}")
    public ResponseEntity<TeamDTO> addMemberToTeam(
            @PathVariable Long teamId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(adminService.addMemberToTeam(teamId, userId));
    }

    @DeleteMapping("/teams/{teamId}/members/{userId}")
    public ResponseEntity<Map<String, String>> removeMemberFromTeam(
            @PathVariable Long teamId,
            @PathVariable Long userId) {
        adminService.removeMemberFromTeam(teamId, userId);
        return ResponseEntity.ok(Map.of("message", "Member removed from team successfully"));
    }

    // ==========================================
    // 4. PROJECT MANAGEMENT
    // ==========================================
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(adminService.getAllProjects());
    }

    @PostMapping("/projects")
    public ResponseEntity<ProjectDTO> createProject(
            @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User admin) {
        return new ResponseEntity<>(adminService.createProject(request, admin), HttpStatus.CREATED);
    }

    @PutMapping("/projects/{projectId}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(adminService.updateProject(projectId, request));
    }

    @PutMapping("/projects/{projectId}/assign/{teamLeaderId}")
    public ResponseEntity<ProjectDTO> assignProjectToLeader(
            @PathVariable Long projectId,
            @PathVariable Long teamLeaderId) {
        return ResponseEntity.ok(adminService.assignProjectToLeader(projectId, teamLeaderId));
    }

    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<Map<String, String>> deleteProject(@PathVariable Long projectId) {
        adminService.deleteProject(projectId);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }
}
package com.example.teamora.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.dto.*;
import com.example.teamora.entity.*;
import com.example.teamora.enums.ProjectStatus;
import com.example.teamora.enums.Role;
import com.example.teamora.enums.TaskStatus;
import com.example.teamora.enums.UserStatus;
import com.example.teamora.exception.BadRequestException;
import com.example.teamora.exception.ResourceNotFoundException;
import com.example.teamora.mapper.EntityMapper;
import com.example.teamora.repository.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final EntityMapper entityMapper;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final DailyFeedbackRepository dailyFeedbackRepository;
    private final PerformanceRatingRepository performanceRatingRepository;
    private final TaskCommentRepository taskCommentRepository;

    public AdminService(
            UserRepository userRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            EntityMapper entityMapper,
            NotificationService notificationService,
            NotificationRepository notificationRepository,
            DailyFeedbackRepository dailyFeedbackRepository,
            PerformanceRatingRepository performanceRatingRepository,
            TaskCommentRepository taskCommentRepository) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.entityMapper = entityMapper;
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        this.dailyFeedbackRepository = dailyFeedbackRepository;
        this.performanceRatingRepository = performanceRatingRepository;
        this.taskCommentRepository = taskCommentRepository;
    }

    // ==========================================
    // 1. ADMIN DASHBOARD & OVERVIEW
    // ==========================================
    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long pendingUsers = userRepository.countByStatus(UserStatus.PENDING);
        long totalTeamLeaders = userRepository.countByRole(Role.TEAM_LEADER);
        long totalTeamMembers = userRepository.countByRole(Role.TEAM_MEMBER);
        long totalTeams = teamRepository.count();

        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);

        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long pendingTasks = taskRepository.countByStatus(TaskStatus.ASSIGNED);

        stats.put("totalUsers", totalUsers);
        stats.put("pendingUsers", pendingUsers);
        stats.put("totalTeamLeaders", totalTeamLeaders);
        stats.put("totalTeamMembers", totalTeamMembers);
        stats.put("totalTeams", totalTeams);
        stats.put("totalProjects", totalProjects);
        stats.put("activeProjects", activeProjects);
        stats.put("completedProjects", completedProjects);
        stats.put("totalTasks", totalTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("pendingTasks", pendingTasks);

        return stats;
    }

    // ==========================================
    // 2. USER MANAGEMENT
    // ==========================================
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(entityMapper::toUserDTO).toList();
    }

    @Transactional
    public UserDTO approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.APPROVED);
        user.setDeactivationReason(null);
        User saved = userRepository.save(user);

        notificationService.createNotification(saved, "Your account has been approved by the Admin. Welcome to Teamora!");
        return entityMapper.toUserDTO(saved);
    }

    @Transactional
    public UserDTO rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.REJECTED);
        return entityMapper.toUserDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO deactivateUser(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot deactivate Admin account");
        }

        user.setStatus(UserStatus.DEACTIVATED);
        user.setDeactivationReason(reason != null ? reason : "Deactivated by administrator");
        return entityMapper.toUserDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.ADMIN && newRole != Role.ADMIN) {
            throw new BadRequestException("Cannot demote primary Admin");
        }

        user.setRole(newRole);
        User saved = userRepository.save(user);

        notificationService.createNotification(saved, "Your role was updated to: " + newRole.name());
        return entityMapper.toUserDTO(saved);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete primary Admin account");
        }

        // Find another active admin for reassigning entities where created_by is non-nullable
        User fallbackAdmin = userRepository.findByRole(Role.ADMIN).stream()
                .filter(a -> !a.getId().equals(userId))
                .findFirst()
                .orElse(null);

        // 1. Delete notifications received by this user
        notificationRepository.deleteByUserId(userId);

        // 2. Delete task comments posted by this user
        taskCommentRepository.deleteByUserId(userId);

        // 3. Delete daily feedback submitted by this user
        dailyFeedbackRepository.deleteByMemberId(userId);

        // 4. Delete performance ratings where user is member or team leader
        performanceRatingRepository.deleteByMemberIdOrTeamLeaderId(userId);

        // 5. Remove team memberships
        teamMemberRepository.deleteByUserId(userId);

        // 6. Unassign tasks assigned to this user
        taskRepository.unassignTasksForUser(userId);

        // If user created tasks, reassign creator to admin
        if (fallbackAdmin != null) {
            taskRepository.reassignCreatedTasks(userId, fallbackAdmin);
        }

        // 7. Clear team leader in teams & reassign creator
        teamRepository.clearTeamLeader(userId);
        if (fallbackAdmin != null) {
            teamRepository.reassignCreatedTeams(userId, fallbackAdmin);
        }

        // 8. Clear assigned leader in projects & reassign creator
        projectRepository.clearAssignedTeamLeader(userId);
        if (fallbackAdmin != null) {
            projectRepository.reassignCreatedProjects(userId, fallbackAdmin);
        }

        // 9. Delete the user
        userRepository.delete(user);
    }

    // ==========================================
    // 3. TEAM MANAGEMENT
    // ==========================================
    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream().map(t -> {
            List<TeamMember> members = teamMemberRepository.findByTeamId(t.getId());
            TeamDTO dto = entityMapper.toTeamDTO(t, members.size());
            dto.setMembers(members.stream().map(tm -> entityMapper.toUserDTO(tm.getUser())).toList());
            return dto;
        }).toList();
    }

    @Transactional
    public TeamDTO createTeam(TeamRequest request, User admin) {
        if (request.getTeamName() == null || request.getTeamName().trim().isEmpty()) {
            throw new BadRequestException("Team name cannot be empty");
        }

        User leader = null;
        if (request.getTeamLeaderId() != null) {
            leader = userRepository.findById(request.getTeamLeaderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team Leader not found"));
            if (leader.getRole() != Role.TEAM_LEADER) {
                // Auto-elevate to TEAM_LEADER if selected as leader
                leader.setRole(Role.TEAM_LEADER);
                userRepository.save(leader);
            }
        }

        Team team = new Team(request.getTeamName().trim(), request.getDescription(), leader, admin);
        Team saved = teamRepository.save(team);

        if (leader != null) {
            notificationService.createNotification(leader, "You have been assigned as Team Leader for team: " + saved.getTeamName());
        }

        return entityMapper.toTeamDTO(saved, 0);
    }

    @Transactional
    public TeamDTO updateTeam(Long teamId, TeamRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

        if (request.getTeamName() != null && !request.getTeamName().trim().isEmpty()) {
            team.setTeamName(request.getTeamName().trim());
        }
        if (request.getDescription() != null) {
            team.setDescription(request.getDescription());
        }
        if (request.getTeamLeaderId() != null) {
            User leader = userRepository.findById(request.getTeamLeaderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team Leader not found"));
            if (leader.getRole() != Role.TEAM_LEADER) {
                leader.setRole(Role.TEAM_LEADER);
                userRepository.save(leader);
            }
            team.setTeamLeader(leader);
            notificationService.createNotification(leader, "You are now assigned as Team Leader for: " + team.getTeamName());
        }

        Team saved = teamRepository.save(team);
        List<TeamMember> members = teamMemberRepository.findByTeamId(saved.getId());
        TeamDTO dto = entityMapper.toTeamDTO(saved, members.size());
        dto.setMembers(members.stream().map(tm -> entityMapper.toUserDTO(tm.getUser())).toList());
        return dto;
    }

    @Transactional
    public void deleteTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
        teamRepository.delete(team);
    }

    @Transactional
    public TeamDTO addMemberToTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (teamMemberRepository.existsByTeamIdAndUserId(teamId, userId)) {
            throw new BadRequestException("User is already in this team");
        }

        TeamMember tm = new TeamMember(team, user);
        teamMemberRepository.save(tm);

        notificationService.createNotification(user, "Admin assigned you to team: " + team.getTeamName());
        if (team.getTeamLeader() != null) {
            notificationService.createNotification(team.getTeamLeader(), "New member @" + user.getUsername() + " was assigned to your team.");
        }

        List<TeamMember> members = teamMemberRepository.findByTeamId(teamId);
        TeamDTO dto = entityMapper.toTeamDTO(team, members.size());
        dto.setMembers(members.stream().map(m -> entityMapper.toUserDTO(m.getUser())).toList());
        return dto;
    }

    @Transactional
    public void removeMemberFromTeam(Long teamId, Long userId) {
        TeamMember tm = teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("User is not in this team"));
        teamMemberRepository.delete(tm);
    }

    // ==========================================
    // 4. PROJECT MANAGEMENT
    // ==========================================
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream().map(p -> {
            List<Task> tasks = taskRepository.findByProjectId(p.getId());
            int completed = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
            return entityMapper.toProjectDTO(p, tasks.size(), completed);
        }).toList();
    }

    @Transactional
    public ProjectDTO createProject(ProjectRequest request, User admin) {
        if (request.getProjectName() == null || request.getProjectName().trim().isEmpty()) {
            throw new BadRequestException("Project name is required");
        }

        User leader = null;
        if (request.getAssignedTeamLeaderId() != null) {
            leader = userRepository.findById(request.getAssignedTeamLeaderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team Leader not found"));
            if (leader.getRole() != Role.TEAM_LEADER) {
                leader.setRole(Role.TEAM_LEADER);
                userRepository.save(leader);
            }
        }

        Project project = new Project(
                request.getProjectName().trim(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus(),
                request.getDeadline(),
                leader,
                admin
        );

        Project saved = projectRepository.save(project);

        if (leader != null) {
            notificationService.createNotification(leader, "New project assigned to you: " + saved.getProjectName());
        }

        return entityMapper.toProjectDTO(saved, 0, 0);
    }

    @Transactional
    public ProjectDTO updateProject(Long projectId, ProjectRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (request.getProjectName() != null && !request.getProjectName().trim().isEmpty()) {
            project.setProjectName(request.getProjectName().trim());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            project.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        if (request.getDeadline() != null) {
            project.setDeadline(request.getDeadline());
        }
        if (request.getAssignedTeamLeaderId() != null) {
            User leader = userRepository.findById(request.getAssignedTeamLeaderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team Leader not found"));
            if (leader.getRole() != Role.TEAM_LEADER) {
                leader.setRole(Role.TEAM_LEADER);
                userRepository.save(leader);
            }
            project.setAssignedTeamLeader(leader);
            notificationService.createNotification(leader, "Project reassigned to you: " + project.getProjectName());
        }

        Project saved = projectRepository.save(project);
        List<Task> tasks = taskRepository.findByProjectId(saved.getId());
        int completed = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        return entityMapper.toProjectDTO(saved, tasks.size(), completed);
    }

    @Transactional
    public ProjectDTO assignProjectToLeader(Long projectId, Long teamLeaderId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User leader = userRepository.findById(teamLeaderId)
                .orElseThrow(() -> new ResourceNotFoundException("Team Leader not found"));

        if (leader.getRole() != Role.TEAM_LEADER) {
            leader.setRole(Role.TEAM_LEADER);
            userRepository.save(leader);
        }

        project.setAssignedTeamLeader(leader);
        Project saved = projectRepository.save(project);

        notificationService.createNotification(leader, "Project assigned to you: " + project.getProjectName());
        List<Task> tasks = taskRepository.findByProjectId(saved.getId());
        int completed = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        return entityMapper.toProjectDTO(saved, tasks.size(), completed);
    }

    @Transactional
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        projectRepository.delete(project);
    }
}
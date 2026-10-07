package com.example.teamora.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.dto.*;
import com.example.teamora.entity.*;
import com.example.teamora.enums.TaskStatus;
import com.example.teamora.exception.BadRequestException;
import com.example.teamora.exception.ResourceNotFoundException;
import com.example.teamora.exception.UnauthorizedException;
import com.example.teamora.mapper.EntityMapper;
import com.example.teamora.repository.*;

@Service
public class TeamLeaderService {

    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TaskRepository taskRepository;
    private final DailyFeedbackRepository dailyFeedbackRepository;
    private final PerformanceRatingRepository performanceRatingRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;
    private final NotificationService notificationService;

    public TeamLeaderService(
            ProjectRepository projectRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            TaskRepository taskRepository,
            DailyFeedbackRepository dailyFeedbackRepository,
            PerformanceRatingRepository performanceRatingRepository,
            UserRepository userRepository,
            EntityMapper entityMapper,
            NotificationService notificationService) {
        this.projectRepository = projectRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.taskRepository = taskRepository;
        this.dailyFeedbackRepository = dailyFeedbackRepository;
        this.performanceRatingRepository = performanceRatingRepository;
        this.userRepository = userRepository;
        this.entityMapper = entityMapper;
        this.notificationService = notificationService;
    }

    // ==========================================
    // 1. PROJECTS & TEAMS
    // ==========================================
    public List<ProjectDTO> getAssignedProjects(User leader) {
        List<Project> projects = projectRepository.findByAssignedTeamLeaderId(leader.getId());
        return projects.stream().map(p -> {
            List<Task> tasks = taskRepository.findByProjectId(p.getId());
            int completed = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
            return entityMapper.toProjectDTO(p, tasks.size(), completed);
        }).toList();
    }

    public TeamDTO getAssignedTeam(User leader) {
        Team team = teamRepository.findByTeamLeaderId(leader.getId()).orElse(null);
        if (team == null) return null;
        List<TeamMember> members = teamMemberRepository.findByTeamId(team.getId());
        TeamDTO dto = entityMapper.toTeamDTO(team, members.size());
        dto.setMembers(members.stream().map(tm -> entityMapper.toUserDTO(tm.getUser())).toList());
        return dto;
    }

    public List<UserDTO> getTeamMembers(User leader) {
        Team team = teamRepository.findByTeamLeaderId(leader.getId()).orElse(null);
        if (team == null) return List.of();
        List<TeamMember> members = teamMemberRepository.findByTeamId(team.getId());
        return members.stream().map(tm -> entityMapper.toUserDTO(tm.getUser())).toList();
    }

    // ==========================================
    // 2. TASK CREATION & DELEGATION
    // ==========================================
    @Transactional
    public TaskDTO createTask(TaskRequest request, User leader) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Task title is required");
        }
        if (request.getProjectId() == null) {
            throw new BadRequestException("Project ID is required");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Verify that this project is assigned to this Team Leader
        if (project.getAssignedTeamLeader() == null || !project.getAssignedTeamLeader().getId().equals(leader.getId())) {
            throw new UnauthorizedException("You can only create tasks for projects assigned to you");
        }

        User assignedMember = null;
        if (request.getAssignedMemberId() != null) {
            assignedMember = userRepository.findById(request.getAssignedMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

            // Verify member belongs to this Team Leader's team
            validateMemberBelongsToLeader(assignedMember.getId(), leader.getId());
        }

        Task task = new Task(
                request.getTitle().trim(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus() != null ? request.getStatus() : TaskStatus.ASSIGNED,
                request.getDeadline(),
                project,
                assignedMember,
                leader
        );

        Task saved = taskRepository.save(task);

        if (assignedMember != null) {
            notificationService.createNotification(assignedMember, "New task assigned: " + saved.getTitle() + " in project " + project.getProjectName());
        }

        return entityMapper.toTaskDTO(saved);
    }

    public List<TaskDTO> getLeaderTasks(User leader) {
        List<Task> tasks = taskRepository.findByTeamLeaderId(leader.getId());
        return tasks.stream().map(entityMapper::toTaskDTO).toList();
    }

    @Transactional
    public TaskDTO updateTask(Long taskId, TaskRequest request, User leader) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getProject().getAssignedTeamLeader().getId().equals(leader.getId())) {
            throw new UnauthorizedException("You can only modify tasks for your projects");
        }

        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            task.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getDeadline() != null) {
            task.setDeadline(request.getDeadline());
        }
        if (request.getAssignedMemberId() != null) {
            validateMemberBelongsToLeader(request.getAssignedMemberId(), leader.getId());
            User member = userRepository.findById(request.getAssignedMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
            task.setAssignedMember(member);
            notificationService.createNotification(member, "Task assigned to you: " + task.getTitle());
        }

        return entityMapper.toTaskDTO(taskRepository.save(task));
    }

    @Transactional
    public TaskDTO assignTaskToMember(Long taskId, Long memberId, User leader) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getProject().getAssignedTeamLeader().getId().equals(leader.getId())) {
            throw new UnauthorizedException("You can only assign tasks for your projects");
        }

        validateMemberBelongsToLeader(memberId, leader.getId());

        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        task.setAssignedMember(member);
        task.setStatus(TaskStatus.ASSIGNED);
        Task saved = taskRepository.save(task);

        notificationService.createNotification(member, "Task assigned to you: " + task.getTitle());
        return entityMapper.toTaskDTO(saved);
    }

    @Transactional
    public void deleteTask(Long taskId, User leader) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getProject().getAssignedTeamLeader().getId().equals(leader.getId())) {
            throw new UnauthorizedException("You can only delete tasks for your projects");
        }

        taskRepository.delete(task);
    }

    // ==========================================
    // 3. PROGRESS & TEAM METRICS
    // ==========================================
    public Map<String, Object> getTeamProgress(User leader) {
        Map<String, Object> map = new HashMap<>();

        List<Task> tasks = taskRepository.findByTeamLeaderId(leader.getId());
        List<UserDTO> members = getTeamMembers(leader);

        long totalTasks = tasks.size();
        long assignedTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.ASSIGNED).count();
        long inProgressTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long completedTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();

        LocalDate today = LocalDate.now();
        long overdueTasks = tasks.stream().filter(t ->
                t.getStatus() != TaskStatus.COMPLETED &&
                t.getDeadline() != null &&
                t.getDeadline().isBefore(today)
        ).count();

        int overallProgress = totalTasks > 0 ? (int) Math.round(((double) completedTasks / totalTasks) * 100) : 0;

        map.put("totalTeamMembers", members.size());
        map.put("totalTasks", totalTasks);
        map.put("assignedTasks", assignedTasks);
        map.put("inProgressTasks", inProgressTasks);
        map.put("completedTasks", completedTasks);
        map.put("overdueTasks", overdueTasks);
        map.put("overallProgress", overallProgress);

        // Per-member breakdown
        List<Map<String, Object>> memberBreakdown = new ArrayList<>();
        for (UserDTO m : members) {
            Map<String, Object> mStats = new HashMap<>();
            List<Task> mTasks = tasks.stream()
                    .filter(t -> t.getAssignedMember() != null && t.getAssignedMember().getId().equals(m.getId()))
                    .toList();
            long mCompleted = mTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
            long mPending = mTasks.stream().filter(t -> t.getStatus() == TaskStatus.ASSIGNED).count();
            long mInProgress = mTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
            int mPct = mTasks.size() > 0 ? (int) Math.round(((double) mCompleted / mTasks.size()) * 100) : 0;

            // Latest rating
            List<PerformanceRating> ratings = performanceRatingRepository.findByMemberIdOrderByDateDesc(m.getId());
            Integer latestRating = ratings.isEmpty() ? null : ratings.get(0).getRating();

            mStats.put("memberId", m.getId());
            mStats.put("memberName", m.getUsername());
            mStats.put("email", m.getEmail());
            mStats.put("assignedTasks", mTasks.size());
            mStats.put("completedTasks", mCompleted);
            mStats.put("pendingTasks", mPending);
            mStats.put("inProgressTasks", mInProgress);
            mStats.put("completionPercentage", mPct);
            mStats.put("performanceRating", latestRating);

            memberBreakdown.add(mStats);
        }
        map.put("memberStats", memberBreakdown);

        return map;
    }

    // ==========================================
    // 4. DAILY FEEDBACK REVIEW
    // ==========================================
    public List<DailyFeedbackDTO> getTeamDailyFeedback(User leader) {
        List<UserDTO> members = getTeamMembers(leader);
        if (members.isEmpty()) return List.of();
        List<Long> memberIds = members.stream().map(UserDTO::getId).toList();
        List<DailyFeedback> feedbackList = dailyFeedbackRepository.findByMemberIdInOrderByDateDesc(memberIds);
        return feedbackList.stream().map(entityMapper::toFeedbackDTO).toList();
    }

    // ==========================================
    // 5. MEMBER PERFORMANCE RATINGS
    // ==========================================
    @Transactional
    public PerformanceRatingDTO rateMember(PerformanceRatingDTO dto, User leader) {
        if (dto.getMemberId() == null || dto.getRating() == null) {
            throw new BadRequestException("Member ID and Rating (1-5) are required");
        }
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        validateMemberBelongsToLeader(dto.getMemberId(), leader.getId());

        User member = userRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        PerformanceRating pr = new PerformanceRating(
                member,
                leader,
                dto.getRating(),
                dto.getFeedback(),
                dto.getDate() != null ? dto.getDate() : LocalDate.now()
        );

        PerformanceRating saved = performanceRatingRepository.save(pr);

        notificationService.createNotification(member, "Team Leader rated your performance: " + saved.getRating() + "/5");
        return entityMapper.toRatingDTO(saved);
    }

    public List<PerformanceRatingDTO> getMemberPerformanceHistory(Long memberId, User leader) {
        validateMemberBelongsToLeader(memberId, leader.getId());
        List<PerformanceRating> list = performanceRatingRepository.findByMemberIdOrderByDateDesc(memberId);
        return list.stream().map(entityMapper::toRatingDTO).toList();
    }

    // Helper: Verify member is allocated to this leader's team
    private void validateMemberBelongsToLeader(Long memberId, Long leaderId) {
        Team team = teamRepository.findByTeamLeaderId(leaderId)
                .orElseThrow(() -> new UnauthorizedException("You are not currently assigned to any team"));

        boolean inTeam = teamMemberRepository.existsByTeamIdAndUserId(team.getId(), memberId);
        if (!inTeam) {
            throw new UnauthorizedException("User is not a member of your assigned team");
        }
    }
}

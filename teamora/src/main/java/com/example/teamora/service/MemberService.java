package com.example.teamora.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.dto.DailyFeedbackDTO;
import com.example.teamora.dto.PerformanceRatingDTO;
import com.example.teamora.dto.TaskCommentDTO;
import com.example.teamora.dto.TaskDTO;
import com.example.teamora.dto.TeamDTO;
import com.example.teamora.entity.DailyFeedback;
import com.example.teamora.entity.PerformanceRating;
import com.example.teamora.entity.Task;
import com.example.teamora.entity.TaskComment;
import com.example.teamora.entity.Team;
import com.example.teamora.entity.TeamMember;
import com.example.teamora.entity.User;
import com.example.teamora.enums.TaskStatus;
import com.example.teamora.exception.BadRequestException;
import com.example.teamora.exception.ResourceNotFoundException;
import com.example.teamora.exception.UnauthorizedException;
import com.example.teamora.mapper.EntityMapper;
import com.example.teamora.repository.DailyFeedbackRepository;
import com.example.teamora.repository.PerformanceRatingRepository;
import com.example.teamora.repository.TaskCommentRepository;
import com.example.teamora.repository.TaskRepository;
import com.example.teamora.repository.TeamMemberRepository;
import com.example.teamora.repository.TeamRepository;

@Service
public class MemberService {

    private final TaskRepository taskRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final DailyFeedbackRepository dailyFeedbackRepository;
    private final PerformanceRatingRepository performanceRatingRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final EntityMapper entityMapper;
    private final NotificationService notificationService;

    public MemberService(
            TaskRepository taskRepository,
            TaskCommentRepository taskCommentRepository,
            DailyFeedbackRepository dailyFeedbackRepository,
            PerformanceRatingRepository performanceRatingRepository,
            TeamMemberRepository teamMemberRepository,
            TeamRepository teamRepository,
            EntityMapper entityMapper,
            NotificationService notificationService) {
        this.taskRepository = taskRepository;
        this.taskCommentRepository = taskCommentRepository;
        this.dailyFeedbackRepository = dailyFeedbackRepository;
        this.performanceRatingRepository = performanceRatingRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.teamRepository = teamRepository;
        this.entityMapper = entityMapper;
        this.notificationService = notificationService;
    }

    // ==========================================
    // 1. TASKS
    // ==========================================
    public List<TaskDTO> getMyTasks(User member) {
        List<Task> tasks = taskRepository.findByAssignedMemberId(member.getId());
        return tasks.stream().map(entityMapper::toTaskDTO).toList();
    }

    public TaskDTO getTaskById(User member, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (task.getAssignedMember() == null || !task.getAssignedMember().getId().equals(member.getId())) {
            throw new UnauthorizedException("You are not authorized to view this task");
        }
        return entityMapper.toTaskDTO(task);
    }

    @Transactional
    public TaskDTO startTask(User member, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (task.getAssignedMember() == null || !task.getAssignedMember().getId().equals(member.getId())) {
            throw new UnauthorizedException("You are not authorized to modify this task");
        }

        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setUpdatedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);

        if (task.getProject() != null && task.getProject().getAssignedTeamLeader() != null) {
            notificationService.createNotification(
                    task.getProject().getAssignedTeamLeader(),
                    "Member " + member.getUsername() + " started task: " + task.getTitle()
            );
        }

        return entityMapper.toTaskDTO(saved);
    }

    @Transactional
    public TaskDTO completeTask(User member, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (task.getAssignedMember() == null || !task.getAssignedMember().getId().equals(member.getId())) {
            throw new UnauthorizedException("You are not authorized to modify this task");
        }

        task.setStatus(TaskStatus.COMPLETED);
        task.setUpdatedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);

        if (task.getProject() != null && task.getProject().getAssignedTeamLeader() != null) {
            notificationService.createNotification(
                    task.getProject().getAssignedTeamLeader(),
                    "Member " + member.getUsername() + " completed task: " + task.getTitle()
            );
        }

        return entityMapper.toTaskDTO(saved);
    }

    @Transactional
    public TaskDTO updateTaskStatus(User member, Long taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (task.getAssignedMember() == null || !task.getAssignedMember().getId().equals(member.getId())) {
            throw new UnauthorizedException("You are not authorized to modify this task");
        }

        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);

        if (task.getProject() != null && task.getProject().getAssignedTeamLeader() != null) {
            notificationService.createNotification(
                    task.getProject().getAssignedTeamLeader(),
                    "Member " + member.getUsername() + " updated task '" + task.getTitle() + "' status to " + status
            );
        }

        return entityMapper.toTaskDTO(saved);
    }

    // ==========================================
    // 2. TASK COMMENTS
    // ==========================================
    public List<TaskCommentDTO> getTaskComments(User member, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        // Member must be assigned to task or in the same team/project
        if (task.getAssignedMember() == null || !task.getAssignedMember().getId().equals(member.getId())) {
            throw new UnauthorizedException("You can only view comments on your assigned tasks");
        }

        List<TaskComment> comments = taskCommentRepository.findByTaskIdOrderByCreatedAtAsc(taskId);
        return comments.stream().map(entityMapper::toCommentDTO).toList();
    }

    @Transactional
    public TaskCommentDTO addComment(User member, Long taskId, String commentText) {
        if (commentText == null || commentText.trim().isEmpty()) {
            throw new BadRequestException("Comment cannot be empty");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (task.getAssignedMember() == null || !task.getAssignedMember().getId().equals(member.getId())) {
            throw new UnauthorizedException("You can only comment on tasks assigned to you");
        }

        TaskComment comment = new TaskComment(task, member, commentText.trim());
        TaskComment saved = taskCommentRepository.save(comment);

        if (task.getProject() != null && task.getProject().getAssignedTeamLeader() != null) {
            notificationService.createNotification(
                    task.getProject().getAssignedTeamLeader(),
                    "Member " + member.getUsername() + " commented on task '" + task.getTitle() + "'"
            );
        }

        return entityMapper.toCommentDTO(saved);
    }

    // ==========================================
    // 3. DAILY FEEDBACK
    // ==========================================
    @Transactional
    public DailyFeedbackDTO submitDailyFeedback(User member, DailyFeedbackDTO dto) {
        if (dto.getWorkCompleted() == null || dto.getWorkCompleted().trim().isEmpty()) {
            throw new BadRequestException("Work completed description is required");
        }

        DailyFeedback feedback = new DailyFeedback();
        feedback.setMember(member);
        feedback.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());
        feedback.setWorkCompleted(dto.getWorkCompleted().trim());
        feedback.setProgress(dto.getProgress() != null ? dto.getProgress() : 0);
        feedback.setIssues(dto.getIssues());
        feedback.setNextPlan(dto.getNextPlan());

        DailyFeedback saved = dailyFeedbackRepository.save(feedback);

        // Notify member's team leader if they belong to a team
        teamMemberRepository.findByUserId(member.getId()).ifPresent(tm -> {
            Team team = tm.getTeam();
            if (team != null && team.getTeamLeader() != null) {
                notificationService.createNotification(
                        team.getTeamLeader(),
                        "Member " + member.getUsername() + " submitted daily feedback for " + saved.getDate()
                );
            }
        });

        return entityMapper.toFeedbackDTO(saved);
    }

    public List<DailyFeedbackDTO> getMyDailyFeedbackHistory(User member) {
        List<DailyFeedback> feedbacks = dailyFeedbackRepository.findByMemberIdOrderByDateDesc(member.getId());
        return feedbacks.stream().map(entityMapper::toFeedbackDTO).toList();
    }

    // ==========================================
    // 4. TEAM & PERFORMANCE
    // ==========================================
    public TeamDTO getMyTeam(User member) {
        TeamMember tm = teamMemberRepository.findByUserId(member.getId()).orElse(null);
        if (tm == null) return null;

        Team team = tm.getTeam();
        List<TeamMember> allMembers = teamMemberRepository.findByTeamId(team.getId());
        TeamDTO dto = entityMapper.toTeamDTO(team, allMembers.size());
        dto.setMembers(allMembers.stream().map(m -> entityMapper.toUserDTO(m.getUser())).toList());
        return dto;
    }

    public List<PerformanceRatingDTO> getMyPerformanceRatings(User member) {
        List<PerformanceRating> ratings = performanceRatingRepository.findByMemberIdOrderByDateDesc(member.getId());
        return ratings.stream().map(entityMapper::toRatingDTO).toList();
    }

    // ==========================================
    // 5. MEMBER DASHBOARD
    // ==========================================
    public Map<String, Object> getDashboardStats(User member) {
        List<Task> tasks = taskRepository.findByAssignedMemberId(member.getId());

        long total = tasks.size();
        long assigned = tasks.stream().filter(t -> t.getStatus() == TaskStatus.ASSIGNED).count();
        long inProgress = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long completed = tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();

        List<PerformanceRating> ratings = performanceRatingRepository.findByMemberIdOrderByDateDesc(member.getId());
        double avgRating = ratings.isEmpty() ? 0.0 : ratings.stream().mapToInt(PerformanceRating::getRating).average().orElse(0.0);

        TeamDTO teamDto = getMyTeam(member);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", total);
        stats.put("assignedTasks", assigned);
        stats.put("inProgressTasks", inProgress);
        stats.put("completedTasks", completed);
        stats.put("averagePerformanceRating", Math.round(avgRating * 10.0) / 10.0);
        stats.put("recentTasks", tasks.stream().limit(5).map(entityMapper::toTaskDTO).toList());
        stats.put("team", teamDto);

        return stats;
    }
}

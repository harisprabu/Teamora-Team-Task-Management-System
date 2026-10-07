package com.example.teamora.mapper;

import org.springframework.stereotype.Component;
import com.example.teamora.dto.*;
import com.example.teamora.entity.*;

@Component
public class EntityMapper {

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getDeactivationReason(),
                user.getCreatedAt()
        );
    }

    public TeamDTO toTeamDTO(Team team, int memberCount) {
        if (team == null) return null;
        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setTeamName(team.getTeamName());
        dto.setDescription(team.getDescription());
        if (team.getTeamLeader() != null) {
            dto.setTeamLeaderId(team.getTeamLeader().getId());
            dto.setTeamLeaderName(team.getTeamLeader().getUsername());
        }
        if (team.getCreatedBy() != null) {
            dto.setCreatedById(team.getCreatedBy().getId());
        }
        dto.setMemberCount(memberCount);
        dto.setCreatedAt(team.getCreatedAt());
        return dto;
    }

    public ProjectDTO toProjectDTO(Project project, int totalTasks, int completedTasks) {
        if (project == null) return null;
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setProjectName(project.getProjectName());
        dto.setDescription(project.getDescription());
        dto.setPriority(project.getPriority());
        dto.setStatus(project.getStatus());
        dto.setDeadline(project.getDeadline());
        if (project.getAssignedTeamLeader() != null) {
            dto.setAssignedTeamLeaderId(project.getAssignedTeamLeader().getId());
            dto.setAssignedTeamLeaderName(project.getAssignedTeamLeader().getUsername());
        }
        if (project.getCreatedBy() != null) {
            dto.setCreatedById(project.getCreatedBy().getId());
        }
        dto.setTotalTasks(totalTasks);
        dto.setCompletedTasks(completedTasks);
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }

    public TaskDTO toTaskDTO(Task task) {
        if (task == null) return null;
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setDeadline(task.getDeadline());
        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
            dto.setProjectName(task.getProject().getProjectName());
        }
        if (task.getAssignedMember() != null) {
            dto.setAssignedMemberId(task.getAssignedMember().getId());
            dto.setAssignedMemberName(task.getAssignedMember().getUsername());
        }
        if (task.getCreatedBy() != null) {
            dto.setCreatedById(task.getCreatedBy().getId());
            dto.setCreatedByName(task.getCreatedBy().getUsername());
        }
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    public TaskCommentDTO toCommentDTO(TaskComment c) {
        if (c == null) return null;
        return new TaskCommentDTO(
                c.getId(),
                c.getTask() != null ? c.getTask().getId() : null,
                c.getUser() != null ? c.getUser().getId() : null,
                c.getUser() != null ? c.getUser().getUsername() : null,
                c.getComment(),
                c.getCreatedAt()
        );
    }

    public DailyFeedbackDTO toFeedbackDTO(DailyFeedback f) {
        if (f == null) return null;
        return new DailyFeedbackDTO(
                f.getId(),
                f.getMember() != null ? f.getMember().getId() : null,
                f.getMember() != null ? f.getMember().getUsername() : null,
                f.getDate(),
                f.getWorkCompleted(),
                f.getProgress(),
                f.getIssues(),
                f.getNextPlan(),
                f.getCreatedAt()
        );
    }

    public PerformanceRatingDTO toRatingDTO(PerformanceRating r) {
        if (r == null) return null;
        return new PerformanceRatingDTO(
                r.getId(),
                r.getMember() != null ? r.getMember().getId() : null,
                r.getMember() != null ? r.getMember().getUsername() : null,
                r.getTeamLeader() != null ? r.getTeamLeader().getId() : null,
                r.getTeamLeader() != null ? r.getTeamLeader().getUsername() : null,
                r.getRating(),
                r.getFeedback(),
                r.getDate(),
                r.getCreatedAt()
        );
    }

    public NotificationDTO toNotificationDTO(Notification n) {
        if (n == null) return null;
        return new NotificationDTO(
                n.getId(),
                n.getUser() != null ? n.getUser().getId() : null,
                n.getMessage(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}

package com.example.teamora.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.dto.NotificationDTO;
import com.example.teamora.entity.Notification;
import com.example.teamora.entity.User;
import com.example.teamora.mapper.EntityMapper;
import com.example.teamora.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EntityMapper entityMapper;

    public NotificationService(NotificationRepository notificationRepository, EntityMapper entityMapper) {
        this.notificationRepository = notificationRepository;
        this.entityMapper = entityMapper;
    }

    @Transactional
    public void createNotification(User recipient, String message) {
        if (recipient == null || message == null || message.trim().isEmpty()) return;
        Notification n = new Notification(recipient, message.trim());
        notificationRepository.save(n);
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return list.stream().map(entityMapper::toNotificationDTO).toList();
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}

package com.example.teamora.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.teamora.entity.User;
import com.example.teamora.enums.Role;
import com.example.teamora.enums.UserStatus;
import com.example.teamora.repository.UserRepository;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            userRepository.findByUsername("admin").ifPresentOrElse(
                admin -> {
                    boolean updated = false;
                    if (admin.getRole() != Role.ADMIN) {
                        admin.setRole(Role.ADMIN);
                        updated = true;
                    }
                    if (admin.getStatus() != UserStatus.APPROVED) {
                        admin.setStatus(UserStatus.APPROVED);
                        updated = true;
                    }
                    if (updated) {
                        userRepository.save(admin);
                    }
                    System.out.println("=================================");
                    System.out.println("TEAMORA ADMIN VERIFIED (APPROVED)");
                    System.out.println("Username: admin");
                    System.out.println("=================================");
                },
                () -> {
                    User admin = new User();
                    admin.setUsername("admin");
                    admin.setEmail("admin@teamora.com");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole(Role.ADMIN);
                    admin.setStatus(UserStatus.APPROVED);

                    userRepository.save(admin);

                    System.out.println("=================================");
                    System.out.println("TEAMORA ADMIN CREATED");
                    System.out.println("Username: admin");
                    System.out.println("Password: admin123");
                    System.out.println("Role: ADMIN");
                    System.out.println("Status: APPROVED");
                    System.out.println("=================================");
                }
            );
        };
    }
}
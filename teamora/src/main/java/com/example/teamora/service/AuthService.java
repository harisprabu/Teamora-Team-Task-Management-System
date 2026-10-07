package com.example.teamora.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.teamora.dto.AuthResponse;
import com.example.teamora.dto.LoginRequest;
import com.example.teamora.dto.RegisterRequest;
import com.example.teamora.entity.User;
import com.example.teamora.enums.Role;
import com.example.teamora.enums.UserStatus;
import com.example.teamora.exception.BadRequestException;
import com.example.teamora.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new BadRequestException("Username cannot be empty");
        }
        if (request.getEmail() == null || !request.getEmail().contains("@")) {
            throw new BadRequestException("Valid email is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already exists");
        }

        // Strict rule: Registration is always TEAM_MEMBER with PENDING status
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.TEAM_MEMBER);
        user.setStatus(UserStatus.PENDING);

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                null,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getStatus(),
                "Registration successful. Please wait for Admin approval before logging in."
        );
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new BadRequestException("Username cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BadRequestException("Password cannot be empty");
        }

        String identifier = request.getUsername().trim();

        User user = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        // Check account approval status
        if (user.getStatus() == UserStatus.PENDING) {
            throw new BadRequestException("Your account is currently waiting for Admin approval.");
        }
        if (user.getStatus() == UserStatus.REJECTED) {
            throw new BadRequestException("Your account registration was rejected by Admin.");
        }
        if (user.getStatus() == UserStatus.DEACTIVATED) {
            throw new BadRequestException("Your account has been deactivated. Reason: " +
                    (user.getDeactivationReason() != null ? user.getDeactivationReason() : "Contact admin"));
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                "Login successful"
        );
    }
}
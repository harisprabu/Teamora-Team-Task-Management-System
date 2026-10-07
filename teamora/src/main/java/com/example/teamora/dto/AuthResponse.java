package com.example.teamora.dto;

import com.example.teamora.enums.Role;
import com.example.teamora.enums.UserStatus;

public class AuthResponse {

    private String token;
    private Long id;
    private String username;
    private String email;
    private Role role;
    private UserStatus status;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String username, String email, Role role, UserStatus status, String message) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.status = status;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
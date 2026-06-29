package com.focusflow.mapper;

import com.focusflow.dto.auth.RegisterRequest;
import com.focusflow.dto.auth.RegisterResponse;
import com.focusflow.dto.auth.LoginResponse;
import com.focusflow.entity.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * Mapper for converting between User entity and authentication-related DTOs.
 */
@Component
public class UserMapper {

    /**
     * Convert RegisterRequest to a new User entity.
     *
     * @param request The RegisterRequest DTO.
     * @return User entity.
     */
    public User toEntity(RegisterRequest request) {
        if (request == null) {
            return null;
        }

        return User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // Note: password will be hashed in the service layer
                .tasks(new ArrayList<>())
                .build();
    }

    /**
     * Convert User entity to RegisterResponse.
     *
     * @param user The User entity.
     * @return RegisterResponse DTO.
     */
    public RegisterResponse toRegisterResponse(User user) {
        if (user == null) {
            return null;
        }

        return RegisterResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * Convert User entity and JWT token to LoginResponse.
     *
     * @param user  The User entity.
     * @param token The generated JWT token.
     * @return LoginResponse DTO.
     */
    public LoginResponse toLoginResponse(User user, String token) {
        if (user == null) {
            return null;
        }

        return LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}

package com.focusflow.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing the response after a successful registration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
}

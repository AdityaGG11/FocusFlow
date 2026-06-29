package com.focusflow.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.focusflow.dto.auth.LoginRequest;
import com.focusflow.dto.auth.LoginResponse;
import com.focusflow.dto.auth.RegisterRequest;
import com.focusflow.dto.auth.RegisterResponse;
import com.focusflow.entity.User;
import com.focusflow.exception.DuplicateResourceException;
import com.focusflow.mapper.UserMapper;
import com.focusflow.repository.UserRepository;
import com.focusflow.security.JwtUtils;
import com.focusflow.security.SecurityUser;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Register a new user.
     *
     * @param request The registration details.
     * @return The registered user details.
     */
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User savedUser = userRepository.save(user);
        return userMapper.toRegisterResponse(savedUser);
    }

    /**
     * Authenticate a user and generate a JWT token.
     *
     * @param request The login credentials.
     * @return The auth response containing token and user info.
     */
    @Transactional(readOnly = true)
public LoginResponse login(LoginRequest request) {
    try {
        System.out.println("LOGIN STEP 1");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword())
        );

        System.out.println("LOGIN STEP 2");

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new DuplicateResourceException("Invalid email or password"));

        System.out.println("LOGIN STEP 3");

        UserDetails userDetails = new SecurityUser(user);

        System.out.println("LOGIN STEP 4");

        String token = jwtUtils.generateToken(userDetails);

        System.out.println("LOGIN STEP 5");

        LoginResponse response = userMapper.toLoginResponse(user, token);

        System.out.println("LOGIN STEP 6");

        return response;

    } catch (Exception e) {
        System.out.println("LOGIN FAILED");
        e.printStackTrace();
        throw e;
    }
}
}

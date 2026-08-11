package com.manufolio.service.impl;

import com.manufolio.dto.LoginResponse;
import com.manufolio.entity.AdminUser;
import com.manufolio.exception.UnauthorizedException;
import com.manufolio.repository.AdminUserRepository;
import com.manufolio.request.LoginRequest;
import com.manufolio.service.AuthService;
import com.manufolio.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService implementation — handles login and refresh token exchange.
 * Uses BCrypt to verify passwords and JJWT to generate tokens.
 */
@Slf4j
@Service
public class AuthServiceImpl implements AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Constructor injection — no @Autowired
    public AuthServiceImpl(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("[AUTH] Login attempt for username: {}", request.getUsername());

        AdminUser user = adminUserRepository
                .findByUsernameAndActiveTrue(request.getUsername())
                .orElseThrow(() -> {
                    log.warn("[AUTH] Login failed — user not found: {}", request.getUsername());
                    return new UnauthorizedException("Invalid credentials");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("[AUTH] Login failed — wrong password for user: {}", request.getUsername());
            throw new UnauthorizedException("Invalid credentials");
        }

        String accessToken  = jwtUtil.generateAccessToken(user.getUsername(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        log.info("[AUTH] Login successful for user: {}", user.getUsername());

        return LoginResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenExpiration())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            log.warn("[AUTH] Invalid or expired refresh token");
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        AdminUser user = adminUserRepository
                .findByUsernameAndActiveTrue(username)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        String newAccessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getRole().name());
        log.info("[AUTH] Token refreshed for user: {}", username);

        return LoginResponse.builder()
                .token(newAccessToken)
                .refreshToken(refreshToken) // return same refresh token (rotation can be added later)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenExpiration())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }
}

package com.manufolio.dto;

import lombok.Builder;
import lombok.Data;

/**
 * JWT authentication response — carries both access and refresh tokens.
 * Designed to support refresh token rotation without API redesign.
 */
@Data
@Builder
public class LoginResponse {

    private String token;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;     // access token expiry in milliseconds
    private String username;
    private String role;
}

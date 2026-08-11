package com.manufolio.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT utility — generates and validates both access and refresh tokens.
 * Uses HMAC-SHA256. Designed for future refresh token rotation support.
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(secret.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ── Token Generation ──────────────────────────────────────────────────────

    public String generateAccessToken(String username, String role) {
        return buildToken(username, role, accessTokenExpiration, "ACCESS");
    }

    public String generateRefreshToken(String username) {
        return buildToken(username, null, refreshTokenExpiration, "REFRESH");
    }

    private String buildToken(String username, String role, long expiration, String tokenType) {
        JwtBuilder builder = Jwts.builder()
                .subject(username)
                .claim("type", tokenType)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey());

        if (role != null) {
            builder.claim("role", role);
        }
        return builder.compact();
    }

    // ── Extraction ────────────────────────────────────────────────────────────

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public String extractTokenType(String token) {
        return parseClaims(token).get("type", String.class);
    }

    // ── Validation ────────────────────────────────────────────────────────────

    public boolean isAccessToken(String token) {
        return "ACCESS".equals(extractTokenType(token));
    }

    public boolean isRefreshToken(String token) {
        return "REFRESH".equals(extractTokenType(token));
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("[JWT] Token expired for user: {}", e.getClaims().getSubject());
        } catch (UnsupportedJwtException e) {
            log.warn("[JWT] Unsupported token");
        } catch (MalformedJwtException e) {
            log.warn("[JWT] Malformed token");
        } catch (SecurityException e) {
            log.warn("[JWT] Invalid signature");
        } catch (IllegalArgumentException e) {
            log.warn("[JWT] Empty claims string");
        }
        return false;
    }

    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

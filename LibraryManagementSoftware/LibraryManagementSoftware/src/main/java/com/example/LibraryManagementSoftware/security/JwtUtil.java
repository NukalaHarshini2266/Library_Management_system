package com.example.LibraryManagementSoftware.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final long expiration = 1000 * 60 * 60; // 1 hour

    // Generate token using email and a secret key (supports multiple secrets)
    public String generateToken(String email, String secretKey) {
        if (secretKey.length() < 32) {
            throw new IllegalArgumentException("Secret key must be at least 32 characters for HS256.");
        }
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Default token generation for normal users
    private static final String USER_SECRET_KEY = "my_super_secure_user_secret_key_123456";
    public String generateToken(String email) {
        return generateToken(email, USER_SECRET_KEY);
    }
}

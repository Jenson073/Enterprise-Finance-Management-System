package com.project2.controller;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project2.dto.ChangePasswordDto;
import com.project2.dto.Logindto;
import com.project2.model.AdminUser;
import com.project2.repo.AdminRepo;
import com.project2.security.Jwtutil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AdminRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Jwtutil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Logindto request,
            HttpServletResponse response) {

        AdminUser user = userRepo.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null ||
            !passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // true in prod
                .path("/")
                .maxAge(60 * 60)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Login successful");
    }
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {

        String token = null;

        // extract JWT from cookie
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("token".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Not authenticated");
        }

        String username = jwtUtil.extractUsername(token);

        AdminUser user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 return safe info only
        return ResponseEntity.ok(
            Map.of(
                "username", user.getUsername(),
                "role", user.getRole()
            )
        );
    }
    
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody Logindto request) {

        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        AdminUser user = new AdminUser();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt
        user.setRole("user"); // 🔥 FORCE USER ROLE
        user.setEnabled(true);

        userRepo.save(user);

        return ResponseEntity.ok("User created successfully");
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok("Logged out");
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordDto dto,
            HttpServletRequest request,
            HttpServletResponse response) {

        String token = null;

        // extract JWT from cookie
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("token".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Not authenticated");
        }

        String username = jwtUtil.extractUsername(token);

        AdminUser user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // validate old password
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Old password incorrect");
        }

        // update new password
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);

        // logout after password change (important)
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Password changed successfully. Please login again.");
    }

}

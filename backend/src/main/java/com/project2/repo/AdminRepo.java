package com.project2.repo;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project2.model.AdminUser;

public interface AdminRepo extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByUsername(String username);
}


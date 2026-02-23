package com.project2.loginsecurity;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project2.model.AdminUser;
import com.project2.repo.AdminRepo;

@Configuration
public class InitialData {

    @Bean
    CommandLineRunner initUser(AdminRepo repo, PasswordEncoder encoder) {
    	return args -> {

            repo.findByUsername("admin")
                    .ifPresentOrElse(
                        user -> {
                            // ✅ Admin already exists → DO NOTHING
                            System.out.println("Admin already exists");
                        },
                        () -> {
                            // ✅ Create only if missing
                            AdminUser admin = new AdminUser();
                            admin.setUsername("admin");
                            admin.setPassword(encoder.encode("admin123"));
                            repo.save(admin);

                            System.out.println("Admin created");
                        }
                    );
        };
    }
}

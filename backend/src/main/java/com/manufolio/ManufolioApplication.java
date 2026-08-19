package com.manufolio;

import com.manufolio.entity.AdminUser;
import com.manufolio.enums.UserRole;
import com.manufolio.repository.AdminUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Manufolio Spring Boot Application entry point.
 * Seeds the initial admin user on first startup if not already present.
 */
@Slf4j
@SpringBootApplication
public class ManufolioApplication {

    @Value("${admin.seed.username:manu}")
    private String seedUsername;

    @Value("${admin.seed.password:manu@123}")
    private String seedPassword;

    @Value("${server.port:10000}")
    private String serverPort;

    public static void main(String[] args) {
        SpringApplication.run(ManufolioApplication.class, args);
    }

    @Bean
    public CommandLineRunner logStartupInfo() {
        return args -> {
            log.info("==========================================");
            log.info(" Manufolio Backend started successfully!");
            log.info(" API available at: http://localhost:{}/api", serverPort);
            log.info("==========================================");
        };
    }

    /**
     * Seeds the admin user on startup using configurable credentials.
     */
    @Bean
    public CommandLineRunner seedAdminUser(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            if (!adminUserRepository.existsByUsername(seedUsername)) {
                AdminUser admin = AdminUser.builder()
                        .username(seedUsername)
                        .password(passwordEncoder.encode(seedPassword))
                        .role(UserRole.ADMIN)
                        .active(true)
                        .build();

                adminUserRepository.save(admin);
                log.info("[SEED] Admin user '{}' created successfully.", seedUsername);
            } else {
                log.info("[SEED] Admin user '{}' already exists — skipping seed.", seedUsername);
            }
        };
    }
}

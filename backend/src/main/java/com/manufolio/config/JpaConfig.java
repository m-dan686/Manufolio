package com.manufolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables JPA Auditing so @CreatedDate and @LastModifiedDate
 * are automatically populated on entity save.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}

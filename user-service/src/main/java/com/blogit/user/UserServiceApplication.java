package com.blogit.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.blogit.user.repository")
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
    private static void initializeOpenTelemetry() {
        // SDK initialization happens via the configuration class
        // or environment variables
        System.setProperty("otel.java.global-autoconfigure.enabled", "true");
    }
}

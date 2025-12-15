package com.aicharya;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AicharyaApplication {
    public static void main(String[] args) {
        SpringApplication.run(AicharyaApplication.class, args);
        System.out.println("✅ Aicharya Backend Server is running on port 8080...");
    }
}
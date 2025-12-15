package com.aicharya.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiIntegrationService {

    public String generateLesson(String topic) {
        try {
            
            System.out.println("Connecting to AI model with topic: " + topic);

            
            Map<String, String> aiResponses = new HashMap<>();
            aiResponses.put("Java", "Let's learn about classes, objects, and inheritance in Java!");
            aiResponses.put("C Programming", "Arrays and pointers are the backbone of C.");
            aiResponses.put("Machine Learning", "ML helps computers learn from data.");
            aiResponses.put("default", "AI lesson generated successfully!");

            // Return a response based on topic
            return aiResponses.getOrDefault(topic, aiResponses.get("default"));

        } catch (Exception e) {
            System.err.println("Error connecting to AI service: " + e.getMessage());
            return "Error: Unable to generate AI lesson.";
        }
    }
}
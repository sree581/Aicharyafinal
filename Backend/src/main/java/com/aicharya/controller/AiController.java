package com.aicharya.controller;

import org.springframework.web.bind.annotation.*;
import com.aicharya.service.AiIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private AiIntegrationService aiService;

    @GetMapping("/generateLesson")
    public String generateLesson(@RequestParam(defaultValue = "Java") String topic) {
        return aiService.generateLesson(topic);
    }
}
package com.aicharya.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/learning")
public class LearningController {

    @GetMapping("/progress")
    public String progress() {
        return "Learning progress endpoint working fine!";
    }
}
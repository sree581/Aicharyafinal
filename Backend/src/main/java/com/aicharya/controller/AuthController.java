package com.aicharya.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/login")
    public String login() {
        return " login API running successfully!";
    }

    @PostMapping("/signup")
    public String signup() {
        return " signup API running successfully!";
    }
}
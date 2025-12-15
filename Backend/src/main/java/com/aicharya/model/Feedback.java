package com.aicharya.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Feedback {

    @Id
    private Long id;
    private String message;
    private int rating;
    private String username;
    private String email;

    public Feedback() {}

    public Feedback(Long id, String message, int rating, String username, String email) {
        this.id = id;
        this.message = message;
        this.rating = rating;
        this.username = username;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void validateFeedback() {
        try {
            if (message == null || message.trim().isEmpty()) {
                throw new IllegalArgumentException("Feedback message cannot be empty.");
            }
            if (rating < 1 || rating > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5.");
            }
            System.out.println("Feedback from " + username + " is valid.");
        } catch (IllegalArgumentException e) {
            System.out.println("Validation error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while validating feedback: " + e.getMessage());
        }
    }
}

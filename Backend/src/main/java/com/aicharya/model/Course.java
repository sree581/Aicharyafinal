package com.aicharya.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Course {

    @Id
    private Long id;
    private String courseName;
    private String description;
    private int classNumber;

    public Course() {}

    public Course(Long id, String courseName, String description, int classNumber) {
        this.id = id;
        this.courseName = courseName;
        this.description = description;
        this.classNumber = classNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getClassNumber() {
        return classNumber;
    }

    public void setClassNumber(int classNumber) {
        this.classNumber = classNumber;
    }
}

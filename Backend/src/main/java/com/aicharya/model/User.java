package com.aicharya.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

enum Role {
    STUDENT
}

interface UserActions {
    void displayInfo();
    boolean isActive();
}

@MappedSuperclass
class Student {
    private String department;
    private int year;

    public Student() {}

    public Student(String department, int year) {
        this.department = department;
        this.year = year;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}

@Entity
public class User extends Student implements UserActions {

    @Id
    private Long id;
    private String username;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role = Role.STUDENT;
    private boolean active;

    public User() {}

    public User(Long id, String username, String email, boolean active, String department, int year) {
        super(department, year);
        this.id = id;
        this.username = username;
        this.email = email;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Role getRole() {
        return role;
    }

    public boolean getActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public void displayInfo() {
        System.out.println("User: " + username + " | Department: " + getDepartment());
    }

    @Override
    public boolean isActive() {
        return active;
    }

    public Object getPassword() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getPassword'");
    }
}

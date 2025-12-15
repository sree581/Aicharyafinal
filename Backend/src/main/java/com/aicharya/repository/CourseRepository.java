package com.aicharya.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aicharya.model.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
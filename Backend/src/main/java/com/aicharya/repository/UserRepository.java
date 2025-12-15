package com.aicharya.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aicharya.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
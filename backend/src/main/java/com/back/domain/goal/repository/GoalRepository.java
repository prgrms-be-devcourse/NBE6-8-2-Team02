package com.back.domain.goal.repository;

import com.back.domain.goal.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Integer> {
    List<Goal> findByMember_Id(int memberId);
}
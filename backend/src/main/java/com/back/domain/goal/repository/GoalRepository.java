package com.back.domain.goal.repository;

import com.back.domain.goal.entity.Goal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository extends JpaRepository<Goal, Integer> {
    Page<Goal> findByMember_Id(int memberId, Pageable pageable);
}
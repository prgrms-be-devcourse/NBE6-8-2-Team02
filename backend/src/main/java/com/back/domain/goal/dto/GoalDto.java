package com.back.domain.goal.dto;

import com.back.domain.goal.entity.Goal;

import java.time.LocalDateTime;

public record GoalDto(
        int id,
        int memberId,
        String description,
        int currentAmount,
        int targetAmount,
        LocalDateTime deadline
) {
    public GoalDto(Goal goal) {
        this(
                goal.getId(),
                goal.getMember().getId(),
                goal.getDescription(),
                goal.getCurrentAmount(),
                goal.getTargetAmount(),
                goal.getDeadline()
        );
    }
}
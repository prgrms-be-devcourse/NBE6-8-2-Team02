package com.back.domain.goal.dto;

import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.entity.GoalType;

import java.time.LocalDateTime;

public record GoalDto(
        int id,
        int memberId,
        String description,
        int currentAmount,
        int targetAmount,
        LocalDateTime deadline,
        GoalType goalType
) {
    public GoalDto(Goal goal) {
        this(
                goal.getId(),
                goal.getMemberId(),
                goal.getDescription(),
                goal.getCurrentAmount(),
                goal.getTargetAmount(),
                goal.getDeadline(),
                goal.getGoalType()
        );
    }
}
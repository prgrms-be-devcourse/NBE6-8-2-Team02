package com.back.domain.goal.dto;

import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.entity.GoalStatus;

import java.time.LocalDateTime;

public record GoalDto(
        int id,
        int memberId,
        String description,
        long currentAmount,
        long targetAmount,
        LocalDateTime deadline,
        GoalStatus status
) {
    public GoalDto(Goal goal) {
        this(
                goal.getId(),
                goal.getMemberId(),
                goal.getDescription(),
                goal.getCurrentAmount(),
                goal.getTargetAmount(),
                goal.getDeadline(),
                goal.getStatus()
        );
    }
}
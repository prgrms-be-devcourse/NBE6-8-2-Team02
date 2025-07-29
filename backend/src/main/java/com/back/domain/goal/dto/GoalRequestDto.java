package com.back.domain.goal.dto;

import com.back.domain.goal.entity.GoalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record GoalRequestDto(
        @NotBlank
        @Size(min = 2, max = 100)
        String description,
        @NotNull
        long currentAmount,
        @NotNull
        long targetAmount,
        @NotNull
        LocalDateTime deadline,
        GoalStatus status
    ) {
}
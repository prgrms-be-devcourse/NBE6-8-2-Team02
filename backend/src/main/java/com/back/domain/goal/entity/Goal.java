package com.back.domain.goal.entity;

import com.back.domain.member.entity.Member;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Goal extends BaseEntity {
    @ManyToOne
    private Member member;

    private String description;
    private int currentAmount;
    private int targetAmount;
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    GoalType goalType;

    public Goal(
            Member member,
            String description,
            int currentAmount,
            int targetAmount,
            LocalDateTime deadline
    ) {
        this.member = member;
        this.description = description;
        this.currentAmount = currentAmount;
        this.targetAmount = targetAmount;
        this.deadline = deadline;
        goalType = GoalType.NOT_STARTED;
    }

    public int getMemberId() {
        return member.getId();
    }

    public void modifyDescription(String description) {
        this.description = description;
    }
    public void modifyCurrentAmount(int currentAmount) {
        this.currentAmount = currentAmount;
    }
    public void modifyTargetAmount(int targetAmount) {
        this.targetAmount = targetAmount;
    }
    public void modifyDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
    public void modifyGoalType(GoalType goalType) {
        this.goalType = goalType;
    }
}
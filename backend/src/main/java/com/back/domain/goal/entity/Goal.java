package com.back.domain.goal.entity;

import com.back.domain.member.entity.Member;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SoftDelete
public class Goal extends BaseEntity {
    @ManyToOne
    private Member member;

    private String description;
    private long currentAmount;
    private long targetAmount;
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    GoalStatus status;

    public int getMemberId() {
        return member.getId();
    }

    public void modifyDescription(String description) {
        this.description = description;
    }
    public void modifyCurrentAmount(long currentAmount) {
        this.currentAmount = currentAmount;
    }
    public void modifyTargetAmount(long targetAmount) {
        this.targetAmount = targetAmount;
    }
    public void modifyDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
    public void modifyGoalType(GoalStatus status) {
        this.status = status;
    }
}
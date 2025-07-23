package com.back.domain.goal.service;

import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.entity.GoalType;
import com.back.domain.goal.repository.GoalRepository;
import com.back.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;

    public Optional<Goal> findById(int id) {
        return goalRepository.findById(id);
    }

    public List<Goal> findByMemberId(int memberId) {
        return goalRepository.findByMember_Id(memberId);
    }

    public Goal create(
            Member member,
            String description,
            int currentAmount,
            int targetAmount,
            LocalDateTime deadline
    ) {
        Goal goal = new Goal(member, description, currentAmount, targetAmount, deadline);

        return goalRepository.save(goal);
    }

    public void modify(
            Goal goal,
            String description,
            int currentAmount,
            int targetAmount,
            LocalDateTime deadline,
            GoalType goalType
    ) {
        goal.modifyDescription(description);
        goal.modifyCurrentAmount(currentAmount);
        goal.modifyTargetAmount(targetAmount);
        goal.modifyDeadline(deadline);
        goal.modifyGoalType(goalType);
    }

    public void delete(Goal post) {
        goalRepository.delete(post);
    }
}
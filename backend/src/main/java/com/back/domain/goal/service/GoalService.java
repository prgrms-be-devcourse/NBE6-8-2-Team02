package com.back.domain.goal.service;

import com.back.domain.goal.dto.GoalRequestDto;
import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.repository.GoalRepository;
import com.back.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;

    @Transactional(readOnly = true)
    public Goal findById(int id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 목표입니다."));
    }

    @Transactional(readOnly = true)
    public List<Goal> findByMemberId(int memberId) {
        return goalRepository.findByMember_Id(memberId);
    }

    @Transactional
    public Goal create(Member member, GoalRequestDto reqBody) {
        Goal goal = Goal.builder()
                .member(member)
                .description(reqBody.description())
                .currentAmount(reqBody.currentAmount())
                .targetAmount(reqBody.targetAmount())
                .deadline(reqBody.deadline())
                .status(reqBody.status())
                .build();

        return goalRepository.save(goal);
    }

    @Transactional
    public void modify(int id, GoalRequestDto reqBody) {
        Goal goal = this.findById(id);

        goal.modifyDescription(reqBody.description());
        goal.modifyCurrentAmount(reqBody.currentAmount());
        goal.modifyTargetAmount(reqBody.targetAmount());
        goal.modifyDeadline(reqBody.deadline());
        goal.modifyGoalType(reqBody.status());
    }

    @Transactional
    public void delete(int id) {
        goalRepository.deleteById(id);
    }
}
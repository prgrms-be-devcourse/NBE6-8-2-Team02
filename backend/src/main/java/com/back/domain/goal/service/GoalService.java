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
        return goalRepository.findById(id).orElseThrow();
    }

    @Transactional(readOnly = true)
    public List<Goal> findByMemberId(int memberId) {
        return goalRepository.findByMember_Id(memberId);
    }

    @Transactional
    public Goal create(Member member, GoalRequestDto reqBody) {
        Goal goal = new Goal(member, reqBody.description(), reqBody.currentAmount(), reqBody.targetAmount(), reqBody.deadline());

        return goalRepository.save(goal);
    }

    @Transactional
    public Goal modify(int id, GoalRequestDto reqBody) {
        Goal goal = this.findById(id);

        goal.modifyDescription(reqBody.description());
        goal.modifyCurrentAmount(reqBody.currentAmount());
        goal.modifyTargetAmount(reqBody.targetAmount());
        goal.modifyDeadline(reqBody.deadline());
        goal.modifyGoalType(reqBody.status());

        return goal;
    }

    @Transactional
    public void delete(Goal post) {
        goalRepository.delete(post);
    }
}
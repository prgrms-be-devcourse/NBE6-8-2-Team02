package com.back.domain.goal.service;

import com.back.domain.auth.exception.AuthenticationException;
import com.back.domain.goal.dto.GoalRequestDto;
import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.repository.GoalRepository;
import com.back.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public List<Goal> findByMember(Member member, int page, int size) {
        this.checkMember(member);

        Pageable pageable = PageRequest.of(page, size);

        return goalRepository.findByMember_Id(member.getId(), pageable).getContent();
    }

    @Transactional
    public Goal create(Member member, GoalRequestDto reqBody) {
        this.checkMember(member);

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
        Goal goal = this.findById(id);  //id가 존재하는지 확인

        goalRepository.delete(goal);
    }

    private void checkMember(Member member) {
        if(member == null) {
            throw new AuthenticationException("로그인이 필요합니다.");
        }
    }
}
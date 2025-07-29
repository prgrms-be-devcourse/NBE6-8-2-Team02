package com.back.domain.goal.controller;

import com.back.domain.goal.dto.GoalDto;
import com.back.domain.goal.dto.GoalRequestDto;
import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.service.GoalService;
import com.back.global.rsData.RsData;
import com.back.global.security.jwt.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
@Tag(name = "GoalController", description = "목표 컨트롤러")
public class ApiV1GoalController {
    private final GoalService goalService;

    @GetMapping
    @Operation(summary = "다건 조회")
    public List<GoalDto> getGoals(@AuthenticationPrincipal CustomUserDetails userDetails) {
        int memberId = userDetails.getMember().getId();
        List<Goal> goals = goalService.findByMemberId(memberId);

        return goals
                .stream()
                .map(GoalDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "단건 조회")
    public GoalDto getGoal(@PathVariable int id) {
        Goal goal = goalService.findById(id);

        return new GoalDto(goal);
    }

    @PostMapping
    @Operation(summary = "생성")
    public RsData<GoalDto> create(@AuthenticationPrincipal CustomUserDetails userDetails, @Valid @RequestBody GoalRequestDto reqBody) {
        Goal goal = goalService.create(userDetails.getMember(), reqBody);

        return new RsData<>(
                "201-1",
                "목표(id: %d)가 작성되었습니다.".formatted(goal.getId()),
                new GoalDto(goal)
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "수정")
    public RsData<GoalDto> modify(@PathVariable int id, @Valid @RequestBody GoalRequestDto reqBody) {
        Goal goal = goalService.modify(id, reqBody);

        return new RsData<>(
                "200-1",
                "목표(id: %d)가 수정되었습니다.".formatted(goal.getId())
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "삭제")
    public RsData<GoalDto> delete(@PathVariable int id) {
        Goal goal = goalService.findById(id);

        goalService.delete(goal);

        return new RsData<>(
                "200-1",
                "목표(id: %d)가 삭제되었습니다.".formatted(goal.getId())
        );
    }
}
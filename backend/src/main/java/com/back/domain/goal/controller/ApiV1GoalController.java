package com.back.domain.goal.controller;

import com.back.domain.goal.dto.GoalDto;
import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.service.GoalService;
import com.back.domain.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
@Tag(name = "GoalController", description = "목표 컨트롤러")
public class ApiV1GoalController {
    private final GoalService goalService;

    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "다건 조회")
    public List<GoalDto> getGoals(@RequestParam int memberId) {
        List<Goal> goals = goalService.findByMemberId(memberId);

        return goals
                .stream()
                .map(GoalDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @Operation(summary = "단건 조회")
    public GoalDto getGoal(@PathVariable int id) {
        Goal goal = goalService.findById(id).get();

        return new GoalDto(goal);
    }

    record GoalReqBody(
            @NotBlank
            @Size(min = 2, max = 100)
            String description,
            @NotNull
            int currentAmount,
            @NotNull
            int targetAmount,
            @NotNull
            LocalDateTime deadline
    ) {
    }

    @PostMapping
    @Transactional
    @Operation(summary = "생성")
    public ResponseEntity<String> create(
            @Valid @RequestBody GoalReqBody reqBody
    ) {
        Member user = new Member(); //임시

        Goal goal = goalService.create(user, reqBody.description, reqBody.currentAmount, reqBody.targetAmount, reqBody.deadline);

        return ResponseEntity.ok("목표가 생성되었습니다. (ID: %d)".formatted(goal.getId()));
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "수정")
    public ResponseEntity<String> modify(
            @PathVariable int id,
            @Valid @RequestBody GoalReqBody reqBody
    ) {
        Goal goal = goalService.findById(id).get();
        goalService.modify(goal, reqBody.description, reqBody.currentAmount, reqBody.targetAmount, reqBody.deadline);

        return ResponseEntity.ok("목표가 수정되었습니다. (ID: %d)".formatted(goal.getId()));
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "삭제")
    public ResponseEntity<String> delete(@PathVariable int id) {
        Goal goal = goalService.findById(id).get();

        goalService.delete(goal);

        return ResponseEntity.ok("목표가 삭제되었습니다. (ID: %d)".formatted(id));
    }
}
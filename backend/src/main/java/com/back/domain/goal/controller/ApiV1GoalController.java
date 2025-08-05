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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<RsData<List<GoalDto>>> getGoals(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        List<Goal> goals = goalService.findByMember(userDetails.getMember(), page, size);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new RsData<>("200-1",
                        "목표(memberId: %d)를 조회합니다.".formatted(userDetails.getMember().getId()),
                        goals
                            .stream()
                            .map(GoalDto::new)
                            .toList()
                        )
                );
    }

    @GetMapping("/{id}")
    @Operation(summary = "단건 조회")
    public ResponseEntity<RsData<GoalDto>> getGoal(@PathVariable int id) {
        Goal goal = goalService.findById(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new RsData<>("200-1",
                        "목표(id: %d)를 조회합니다.".formatted(goal.getId()),
                        new GoalDto(goal)
                        )
                );
    }

    @PostMapping
    @Operation(summary = "생성")
    public ResponseEntity<RsData<GoalDto>> create(@AuthenticationPrincipal CustomUserDetails userDetails, @Valid @RequestBody GoalRequestDto reqBody) {
        Goal goal = goalService.create(userDetails.getMember(), reqBody);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new RsData<>("201-1",
                        "목표(id: %d)가 작성되었습니다.".formatted(goal.getId()),
                        new GoalDto(goal)
                        )
                );
    }

    @PutMapping("/{id}")
    @Operation(summary = "수정")
    public ResponseEntity<RsData<GoalDto>> modify(@PathVariable int id, @Valid @RequestBody GoalRequestDto reqBody) {
        goalService.modify(id, reqBody);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new RsData<>("200-1",
                        "목표(id: %d)가 수정되었습니다.".formatted(id)
                        )
                );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "삭제")
    public ResponseEntity<RsData<GoalDto>> delete(@PathVariable int id) {
        goalService.delete(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new RsData<>("200-1",
                        "목표(id: %d)가 삭제되었습니다.".formatted(id)
                        )
                );
    }
}
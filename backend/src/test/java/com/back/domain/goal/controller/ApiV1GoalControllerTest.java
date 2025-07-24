package com.back.domain.goal.controller;

import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.service.GoalService;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class ApiV1GoalControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private GoalService goalService;

    private Member testmember;
    private Goal testGoal;

    @BeforeEach
    void setUp() {
        testmember = memberRepository.findById(1).get();
        testGoal = goalService.findById(1).get();
    }

    @Test
    @DisplayName("목표 다건 조회")
    void read1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/goals?memberId=" + testmember.getId())
                )
                .andDo(print());

        List<Goal> goalList = goalService.findByMemberId(testmember.getId());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(goalList.size()));
    }

    @Test
    @DisplayName("목표 단건 조회")
    void read2() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/goals/" + testGoal.getId())
                )
                .andDo(print());

        Goal goal = goalService.findById(testGoal.getId()).get();

        System.out.println(" ====================== " + goal.getDeadline().toString());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(goal.getId()))
                .andExpect(jsonPath("$.memberId").value(goal.getMemberId()))
                .andExpect(jsonPath("$.description").value(goal.getDescription()))
                .andExpect(jsonPath("$.currentAmount").value(goal.getCurrentAmount()))
                .andExpect(jsonPath("$.targetAmount").value(goal.getTargetAmount()))
                .andExpect(jsonPath("$.deadline").value(goal.getDeadline().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")).substring(0, 19)))
                .andExpect(jsonPath("$.goalType").value(goal.getGoalType().name()));
    }

    @Test
    @DisplayName("목표 생성")
    void write1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/goals")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "description": "테스트",
                                            "currentAmount": "10",
                                            "targetAmount": "1000",
                                            "deadline": "2030-12-10T00:00:00"
                                        }
                                        """)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"));
//                .andExpect(jsonPath("$.msg").value("목표(id: %d)가 작성되었습니다.".formatted(goal.getId())))
//                .andExpect(jsonPath("$.data.id").value(goal.getId()))
//                .andExpect(jsonPath("$.data.memberId").value(goal.getMemberId()))
//                .andExpect(jsonPath("$.data.description").value(goal.getDescription()))
//                .andExpect(jsonPath("$.data.currentAmount").value(goal.getCurrentAmount()))
//                .andExpect(jsonPath("$.data.targetAmount").value(goal.getTargetAmount()))
//                .andExpect(jsonPath("$.data.deadline").value(Matchers.startsWith(goal.getDeadline().toString().substring(0, 20))))
//                .andExpect(jsonPath("$.data.goalType").value(goal.getGoalType().name()));
    }

    @Test
    @DisplayName("목표 수정")
    void modify1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        put("/api/v1/goals/" + testGoal.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "description": "테스트mod",
                                            "currentAmount": "20",
                                            "targetAmount": "2000",
                                            "deadline": "2030-12-20T00:00:00",
                                            "goalType": "IN_PROGRESS"
                                        }
                                        """)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("목표(id: %d)가 수정되었습니다.".formatted(testGoal.getId())));
    }

    @Test
    @DisplayName("목표 삭제")
    void delete1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/goals/" + testGoal.getId())
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("목표(id: %d)가 삭제되었습니다.".formatted(testGoal.getId())));
    }
}
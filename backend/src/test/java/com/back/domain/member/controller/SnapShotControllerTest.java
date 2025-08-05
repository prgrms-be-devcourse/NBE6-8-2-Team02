package com.back.domain.member.controller;

import com.back.domain.member.repository.MemberRepository;
import com.back.global.security.jwt.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SnapShotControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    JwtUtil jwtutil;

    String token;
    ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        token = jwtutil.generateToken("user1@user.com", 4, "USER");
    }

    @Test
    @DisplayName("스냅샷 등록")
    void createSnapShot() throws Exception {
        mockMvc.perform(post("/api/v1/snapshot/save?totalAsset=10000")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.msg").value("스냅샷을 저장했습니다."));
    }

    @Test
    @DisplayName("스냅샷 조회")
    void findSnapShot() throws Exception {
        mockMvc.perform(get("/api/v1/snapshot")
                        .header("Authorization", "Bearer " + token)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.msg").value("스냅샷을 정상적으로 불러왔습니다."));
    }
}

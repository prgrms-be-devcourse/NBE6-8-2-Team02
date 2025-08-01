package com.back.domain.account.controller;

import com.back.domain.account.exception.AccountNotFoundException;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.account.service.AccountService;
import com.back.global.security.jwt.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiV1AccountControllerTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    AccountService accountService;
    @Autowired
    JwtUtil jwtutil;

    ObjectMapper objectMapper=new ObjectMapper();
    String token;

    @BeforeEach
    void setUp() {
        token = jwtutil.generateToken("user1@user.com", 4);
    }

    @Test
    @DisplayName("계좌 등록")
    void t1() throws Exception {

        String requestBody =
                objectMapper.writeValueAsString(Map.of("memberId", 1,
                        "name", "농협",
                        "accountNumber", "1234567890",
                        "balance", 1000));

        // 계좌 등록
        mockMvc.perform(post("/api/v1/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.memberId").value(4))
                .andExpect(jsonPath("$.data.name").value("농협"))
                .andExpect(jsonPath("$.data.accountNumber").value("1234567890"))
                .andExpect(jsonPath("$.data.balance").value(1000L));
    }

    @Test
    @DisplayName("계좌 다건 조회")
    void t2() throws Exception{
        mockMvc.perform(get("/api/v1/accounts").header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$.data.length()").value(accountRepository.findAllByMemberId(4).size()));
    }

    @Test
    @DisplayName("계좌 단건 조회")
    void t3() throws Exception{
        mockMvc.perform(get("/api/v1/accounts/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$.data.memberId").value(accountRepository.findById(1).get().getMember().getId()))
                .andExpect(jsonPath("$.data.name").value("1-계좌1"))
                .andExpect(jsonPath("$.data.accountNumber").value("1-111"))
                .andExpect(jsonPath("$.data.balance").value(10000L));
    }

    @Test
    @DisplayName("계좌 수정")
    void t4() throws Exception{
        String updateBody=objectMapper.writeValueAsString(Map.of("accountNumber","1-333"));

        mockMvc.perform(put("/api/v1/accounts/1").contentType(MediaType.APPLICATION_JSON).content(updateBody).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.memberId").value(accountRepository.findById(1).get().getMember().getId()))
                .andExpect(jsonPath("$.data.name").value("1-계좌1"))
                .andExpect(jsonPath("$.data.accountNumber").value("1-333"))
                .andExpect(jsonPath("$.data.balance").value(10000L));

        mockMvc.perform(get("/api/v1/accounts/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$.data.accountNumber").value("1-333"));
    }

    @Test
    @DisplayName("계좌 삭제 성공")
    void t5() throws Exception{
        mockMvc.perform(delete("/api/v1/accounts/1").header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent()); // 요청은 성공 But, 응답 본문은 없음 -> 삭제 요청에 가장 자주 사용됨
    }
    @Test
    @DisplayName("계좌 삭제 실패 - 존재하지 않는 계좌")
    void t6() throws Exception{
        int accountId = 99;

        mockMvc.perform(delete("/api/v1/accounts/{accountId}", accountId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
}
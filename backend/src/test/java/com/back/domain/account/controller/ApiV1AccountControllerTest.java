package com.back.domain.account.controller;

import com.back.domain.account.repository.AccountRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private AccountRepository accountRepository;

    ObjectMapper objectMapper=new ObjectMapper();

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
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.memberId").value(1))
                .andExpect(jsonPath("$.data.name").value("농협"))
                .andExpect(jsonPath("$.data.accountNumber").value("1234567890"))
                .andExpect(jsonPath("$.data.balance").value(1000));
    }

    @Test
    @DisplayName("계좌 다건 조회")
    void t2() throws Exception{
        mockMvc.perform(get("/api/v1/accounts"))
                .andExpect(jsonPath("$.data.length()").value(accountRepository.count()));
    }

    @Test
    @DisplayName("계좌 단건 조회")
    void t3() throws Exception{
        mockMvc.perform(get("/api/v1/accounts/1"))
                .andExpect(jsonPath("$.data.memberId").value(1))
                .andExpect(jsonPath("$.data.name").value("1-계좌1"))
                .andExpect(jsonPath("$.data.accountNumber").value("1-111"))
                .andExpect(jsonPath("$.data.balance").value(10000));
    }

    @Test
    @DisplayName("계좌 수정")
    void t4() throws Exception{
        String updateBody=objectMapper.writeValueAsString(Map.of("accountNumber","1-333"));

        mockMvc.perform(put("/api/v1/accounts/1").contentType(MediaType.APPLICATION_JSON).content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.memberId").value(1))
                .andExpect(jsonPath("$.data.name").value("1-계좌1"))
                .andExpect(jsonPath("$.data.accountNumber").value("1-333"))
                .andExpect(jsonPath("$.data.balance").value(10000));

        mockMvc.perform(get("/api/v1/accounts/1"))
                .andExpect(jsonPath("$.data.accountNumber").value("1-333"));
    }

    @Test
    @DisplayName("계좌 삭제")
    void t5() throws Exception{
        mockMvc.perform(delete("/api/v1/accounts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.msg").value("1번 계좌가 삭제되었습니다."));

        mockMvc.perform(get("/api/v1/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(accountRepository.count()));
    }

}
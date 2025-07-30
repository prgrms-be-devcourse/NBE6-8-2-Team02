package com.back.domain.transactions.controller;

import com.back.domain.account.entity.Account;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.transactions.entity.AccountTransaction;
import com.back.domain.transactions.repository.AccountTransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountTransactionControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private AccountTransactionRepository accountTransactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("거래 등록")
    void createAccTransaction() throws Exception {
        Account account = accountRepository.findById(1).get();

        var createRequest = Map.of(
                "accountId", account.getId(),
                "type", "ADD",
                "amount", 1,
                "content", "입금",
                "date", "2021-01-01T00:00:00"
        );

        var createResult = mvc.perform(post("/api/v1/transactions/account")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").value("입금"))
                .andReturn();
    }

    @Test
    @DisplayName("거래 목록(다건) 조회")
    void findAccTransactionAll() throws Exception {
        var findAllResult = mvc.perform(get("/api/v1/transactions/account"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.msg").value("거래 목록을 조회했습니다."))
                .andReturn();
    }

    @Test
    @DisplayName("거래 단건 조회")
    void findAccTransaction() throws Exception {
        AccountTransaction accountTransaction = accountTransactionRepository.findById(1).get();
        Long testAmount = accountTransaction.getAmount();

        var findResult = mvc.perform(get("/api/v1/transactions/account/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.amount").value(testAmount))
                .andReturn();
    }

    @Test
    @DisplayName("거래 삭제")
    void deleteAccTransaction() throws Exception {
        AccountTransaction accountTransaction = accountTransactionRepository.findById(1).get();
        Long testAmount = accountTransaction.getAmount();

        var deleteResult = mvc.perform(delete("/api/v1/transactions/account/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.amount").value(testAmount))
                .andReturn();
    }

    @Test
    @DisplayName("특정 계좌의 거래 목록 조회")
    void findAccTransactionById() throws Exception {
        var findSpecificResult = mvc.perform(get("/api/v1/transactions/account/search/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.msg").value("1번 계좌의 거래 목록을 조회했습니다."))
                .andReturn();
    }
}

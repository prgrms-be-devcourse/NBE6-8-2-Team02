package com.back.domain.transactions.controller;

import com.back.domain.transactions.Dto.CreateTransactionRequestDto;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.service.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApiV1TransactionController.class)
class ApiV1TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService transactionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("거래 등록 API가 정상 동작한다")
    void createTransaction_정상_등록() throws Exception {
        // given
        CreateTransactionRequestDto dto = new CreateTransactionRequestDto(1, "DEPOSIT", 1000, "테스트", "2024-07-23T15:00:00");
        Transaction transaction = Transaction.builder()
                .amount(1000)
                .type(TransactionType.DEPOSIT)
                .content("테스트")
                .date(LocalDateTime.parse("2024-07-23T15:00:00"))
                .build();

        Mockito.when(transactionService.createTransaction(any(CreateTransactionRequestDto.class)))
                .thenReturn(transaction);

        // when & then
        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.msg").value("거래가 등록되었습니다."));
    }
} 
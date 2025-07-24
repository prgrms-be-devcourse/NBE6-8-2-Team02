package com.back.domain.transactions.controller;

import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.transactions.dto.CreateTransactionRequestDto;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.service.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ApiV1TransactionControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    @DisplayName("거래 등록 API가 정상 동작한다")
    void createTransaction_정상_등록() throws Exception {
        // given - 테스트 데이터 생성
        Member member = Member.builder()
                .email("test@test.com")
                .password("password123")
                .name("테스트 사용자")
                .phoneNumber("010-1234-5678")
                .build();
        memberRepository.save(member);

        Asset asset = Asset.builder()
                .member(member)
                .name("테스트 자산")
                .assetType(AssetType.DEPOSIT)
                .assetValue(10000)
                .build();
        assetRepository.save(asset);

        CreateTransactionRequestDto dto = new CreateTransactionRequestDto(
                asset.getId(), "DEPOSIT", 1000, "테스트", "2024-07-23T15:00:00");

        // when & then
        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("거래가 등록되었습니다."))
                .andExpect(jsonPath("$.data").exists());
    }
} 
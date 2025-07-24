package com.back.domain.asset.controller;

import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class ApiV1AssetControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    private Member member;

    @BeforeEach
    void setUp() {
        member = memberRepository.findById(1).get();
    }

    @Test
    @WithMockUser
    @DisplayName("""
            -- 통합테스트 --
            1. 자산 등록
            2. 단건 조회
            3. 수정
            4. 삭제
            5. 전체 조회
            """)
    void testAssetCrudFlow() throws Exception {
        //1. 자산 등록
        var createRequest = Map.of(
                "memberId", member.getId(),
                "name", "카카오뱅크",
                "assetType", "STOCK",
                "assetValue", 500000
        );

        var createResult = mvc.perform(post("/api/v1/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("카카오뱅크"))
                .andReturn();

        int assetId = objectMapper
                .readTree(createResult.getResponse().getContentAsString())
                .path("data").path("id").asInt();

        //2. 자산 단건 조회
        mvc.perform(get("/api/v1/assets/" + assetId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(assetId))
                .andExpect(jsonPath("$.data.name").value("카카오뱅크"))
                .andExpect(jsonPath("$.data.memberId").value(member.getId()));

        //3. 자산 수정 요청
        var updateRequest = Map.of(
                "id", assetId,
                "name", "카카오뱅크우",
                "assetType", "STOCK",
                "assetValue", 600000
        );

        mvc.perform(put("/api/v1/assets/" + assetId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("카카오뱅크우"))
                .andExpect(jsonPath("$.data.assetValue").value(600000));

        //4. 자산 전체 조회
        mvc.perform(get("/api/v1/assets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(assetRepository.count()));

        //5. 자산 삭제
        mvc.perform(delete("/api/v1/assets/" + assetId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.msg").value(assetId + "번 자산을 삭제했습니다."));

        //6. 삭제 후 전체 조회
        mvc.perform(get("/api/v1/assets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(assetRepository.count()));
    }

    @Autowired
    private AssetRepository assetRepository;
}

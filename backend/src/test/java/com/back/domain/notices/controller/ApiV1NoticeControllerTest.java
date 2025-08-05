package com.back.domain.notices.controller;

import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.notices.entity.Notice;
import com.back.domain.notices.repository.NoticeRepository;
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
class ApiV1NoticeControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    JwtUtil jwtUtil;

    ObjectMapper objectMapper = new ObjectMapper();

    private Member adminMember;
    private Notice testNotice;
    private String token;

    @BeforeEach
    void setUp() {
        // 관리자 회원이 없으면 생성
        if (!memberRepository.existsByEmail("admin@admin.com")) {
            adminMember = Member.builder()
                    .email("admin@admin.com")
                    .password("password123")
                    .name("Admin User")
                    .role(Member.MemberRole.ADMIN)
                    .build();
            adminMember = memberRepository.save(adminMember);
        } else {
            adminMember = memberRepository.findByEmail("admin@admin.com").orElseThrow();
        }

        // JWT 토큰 생성 - 실제 사용자 ID 사용
        token = jwtUtil.generateToken(adminMember.getEmail(), adminMember.getId(), "ADMIN");

        // 테스트 공지사항 생성
        testNotice = Notice.builder()
                .member(adminMember)
                .title("테스트 공지사항")
                .content("테스트 내용입니다.")
                .fileUrl("")
                .views(0)
                .build();
        testNotice = noticeRepository.save(testNotice);
    }

    @Test
    @DisplayName("공지사항 전체 조회")
    void getAllNotices() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(get("/api/v1/notices"))
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("공지사항 목록을 조회했습니다."))
                .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @DisplayName("공지사항 단건 조회")
    void getNoticeById() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(get("/api/v1/notices/" + testNotice.getId()))
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("공지사항을 조회했습니다."))
                .andExpect(jsonPath("$.data.id").value(testNotice.getId()))
                .andExpect(jsonPath("$.data.title").value("테스트 공지사항"))
                .andExpect(jsonPath("$.data.content").value("테스트 내용입니다."));
    }

    @Test
    @DisplayName("공지사항 생성 - 관리자 권한")
    void createNotice_Success() throws Exception {
        String requestBody = """
                {
                    "title": "새로운 공지사항",
                    "content": "새로운 내용입니다.",
                    "fileUrl": "https://example.com/file.pdf"
                }
                """;

        ResultActions resultActions = mockMvc
                .perform(post("/api/v1/notices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andDo(print());

        resultActions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("공지사항이 생성되었습니다."))
                .andExpect(jsonPath("$.data.title").value("새로운 공지사항"))
                .andExpect(jsonPath("$.data.content").value("새로운 내용입니다."));
    }

    @Test
    @DisplayName("공지사항 수정 - 관리자 권한")
    void updateNotice_Success() throws Exception {
        String requestBody = """
                {
                    "title": "수정된 공지사항",
                    "content": "수정된 내용입니다.",
                    "fileUrl": "https://example.com/updated.pdf"
                }
                """;

        ResultActions resultActions = mockMvc
                .perform(put("/api/v1/notices/" + testNotice.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("공지사항이 수정되었습니다."))
                .andExpect(jsonPath("$.data.title").value("수정된 공지사항"))
                .andExpect(jsonPath("$.data.content").value("수정된 내용입니다."));
    }

    @Test
    @DisplayName("공지사항 삭제 - 관리자 권한")
    void deleteNotice_Success() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(delete("/api/v1/notices/" + testNotice.getId())
                        .header("Authorization", "Bearer " + token))
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("공지사항이 삭제되었습니다."));
    }
} 
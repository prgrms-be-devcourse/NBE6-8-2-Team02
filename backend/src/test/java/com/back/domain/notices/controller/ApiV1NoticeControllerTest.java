package com.back.domain.notices.controller;

import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.notices.dto.NoticeResponseDto;
import com.back.domain.notices.entity.Notice;
import com.back.domain.notices.service.NoticeService;
import com.back.global.security.jwt.JwtUtil;
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

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class ApiV1NoticeControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private JwtUtil jwtUtil;

    // 테스트용 엔티티
    private Member testMember;
    private String jwtToken;
    private Notice testNotice;

    @BeforeEach
    void setUp() {
        // 테스트용 관리자 회원 가져오기
        testMember = memberRepository.findByEmail("admin@test.com").orElseThrow();
        jwtToken = jwtUtil.generateToken(testMember.getEmail(), testMember.getId());
        
        // 테스트용 공지사항 생성
        testNotice = Notice.builder()
                .member(testMember)
                .title("테스트 공지사항")
                .content("테스트 내용입니다.")
                .fileUrl("")
                .views(0)
                .build();
    }

    @Test
    @DisplayName("공지사항 전체 조회")
    void getAllNotices() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/notices")
                )
                .andDo(print());

        List<NoticeResponseDto> noticeList = noticeService.getAllNotices();

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("공지사항 목록을 조회했습니다."));
    }

    @Test
    @DisplayName("공지사항 단건 조회")
    void getNoticeById() throws Exception {
        // 먼저 공지사항 생성
        NoticeResponseDto savedNotice = noticeService.createNotice(
                new com.back.domain.notices.dto.CreateNoticeRequestDto(
                        "테스트 제목",
                        "테스트 내용",
                        ""
                ),
                testMember
        );

        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/notices/" + savedNotice.id())
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("공지사항을 조회했습니다."))
                .andExpect(jsonPath("$.data.title").value("테스트 제목"))
                .andExpect(jsonPath("$.data.content").value("테스트 내용"));
    }

    @Test
    @DisplayName("공지사항 생성 - 관리자")
    void createNotice() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/notices")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", "Bearer " + jwtToken)
                                .content("""
                                        {
                                            "title": "새로운 공지사항",
                                            "content": "새로운 내용입니다.",
                                            "fileUrl": ""
                                        }
                                        """)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("공지사항이 생성되었습니다."))
                .andExpect(jsonPath("$.data.title").value("새로운 공지사항"))
                .andExpect(jsonPath("$.data.content").value("새로운 내용입니다."));
    }

    @Test
    @DisplayName("공지사항 수정 - 관리자")
    void updateNotice() throws Exception {
        // 먼저 공지사항 생성
        NoticeResponseDto savedNotice = noticeService.createNotice(
                new com.back.domain.notices.dto.CreateNoticeRequestDto(
                        "원본 제목",
                        "원본 내용",
                        ""
                ),
                testMember
        );

        ResultActions resultActions = mvc
                .perform(
                        put("/api/v1/notices/" + savedNotice.id())
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", "Bearer " + jwtToken)
                                .content("""
                                        {
                                            "title": "수정된 제목",
                                            "content": "수정된 내용",
                                            "fileUrl": ""
                                        }
                                        """)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("공지사항이 수정되었습니다."))
                .andExpect(jsonPath("$.data.title").value("수정된 제목"))
                .andExpect(jsonPath("$.data.content").value("수정된 내용"));
    }

    @Test
    @DisplayName("공지사항 삭제 - 관리자")
    void deleteNotice() throws Exception {
        // 먼저 공지사항 생성
        NoticeResponseDto savedNotice = noticeService.createNotice(
                new com.back.domain.notices.dto.CreateNoticeRequestDto(
                        "삭제할 공지사항",
                        "삭제할 내용",
                        ""
                ),
                testMember
        );

        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/notices/" + savedNotice.id())
                                .header("Authorization", "Bearer " + jwtToken)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("공지사항이 삭제되었습니다."));
    }

    @Test
    @DisplayName("공지사항 생성 - 일반 사용자 (실패)")
    void createNoticeAsUser() throws Exception {
        // 일반 사용자 토큰 생성
        Member userMember = memberRepository.findByEmail("user@test.com").orElseThrow();
        String userToken = jwtUtil.generateToken(userMember.getEmail(), userMember.getId());

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/notices")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", "Bearer " + userToken)
                                .content("""
                                        {
                                            "title": "일반 사용자 공지사항",
                                            "content": "일반 사용자 내용",
                                            "fileUrl": ""
                                        }
                                        """)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.msg").value("관리자만 공지사항을 생성할 수 있습니다."));
    }
} 
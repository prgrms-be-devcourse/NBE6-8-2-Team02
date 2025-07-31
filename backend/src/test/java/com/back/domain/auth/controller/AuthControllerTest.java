package com.back.domain.auth.controller;


import com.back.domain.member.repository.MemberRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("로그인 성공")
    void loginSuccess() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "email": "admin@test.com",
                                            "password": "admin123"
                                            }
                                        """)
                )
                .andDo(print());
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").exists())
                .andExpect(jsonPath("$.email").value("admin@test.com"))
                .andExpect(jsonPath("$.name").value("관리자"))
                .andExpect(jsonPath("$.role").value("ADMIN"));

    }

    @Test
    @DisplayName("로그인 실패 - 잘못된 비밀번호")
    void loginFailureWrongPassword() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                        "email": "admin@test.com",
                                        "password": "wrongpassword"
                                        }
                                        """)
                )
                .andDo(print());
        resultActions
                .andExpect(status().isUnauthorized());

    }

    @Test
    @DisplayName("로그인 실패 - 존재하지 않는 이메일")
    void loginFailure_EmailNotFound() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                        "email": "notexist@test.com",
                                        "password": "anyPassword"
                                        }
                                        """)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isUnauthorized());

    }

    @Test
    @DisplayName("로그아웃 성공")
    void logoutSuccess() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/auth/logout")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(print());
        
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(header().exists("Set-Cookie"));
    }

    @Test
    @DisplayName("계정 찾기 성공")
    void findAccountSuccess() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/auth/find-account")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "관리자",
                                            "phoneNumber": "010-0000-0000"
                                        }
                                        """)
                )
                .andDo(print());
        
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@test.com"))
                .andExpect(jsonPath("$.name").value("관리자"));
    }

    @Test
    @DisplayName("계정 찾기 실패 - 일치하는 회원 없음")
    void findAccountFailure() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/auth/find-account")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "존재하지않는사람",
                                            "phoneNumber": "010-9999-9999"
                                        }
                                        """)
                )
                .andDo(print());
        
        resultActions
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("비밀번호 재설정 성공")
    void resetPasswordSuccess() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/auth/reset-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "email": "admin@test.com",
                                            "name": "관리자",
                                            "phoneNumber": "010-0000-0000"
                                        }
                                        """)
                )
                .andDo(print());
        
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("비밀번호 재설정 실패 - 일치하는 회원 없음")
    void resetPasswordFailure() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/auth/reset-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "email": "wrong@test.com",
                                            "name": "관리자",
                                            "phoneNumber": "010-1234-5678"
                                        }
                                        """)
                )
                .andDo(print());
        
        resultActions
                .andExpect(status().isUnauthorized());
    }

}

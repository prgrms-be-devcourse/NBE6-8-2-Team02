package com.back.domain.member.controller;

import com.back.domain.member.repository.MemberRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MemberV1ControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    ObjectMapper objectMapper = new ObjectMapper();


    @Test
    @DisplayName("회원가입")
    void signUpSuccess() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/v1/members/signup")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""

                                        {
                                          "email": "newuser@example.com",
                                          "password": "password123",
                                          "name": "New User"
                                      }
                                      """)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.name").value("New User"));
    }

    @Test
    @DisplayName("이메일 중복검사 - 중복된 이메일")
    void checkEmailDuplicate_Exists() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(get("/api/v1/members/check-email?email=user1@user.com"))
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }

    @Test
    @DisplayName("이메일 중복검사 - 사용가능한 이메일")
    void checkEmailDuplicate_Available() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(get("/api/v1/members/check-email?email=available@test.com"))
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(false));
    }

    @Test
    @DisplayName("전체 회원 조회")
    @WithMockUser(roles = "ADMIN")
    void getAllMembers() throws Exception {
        ResultActions resultActions = mockMvc
                .perform(get("/api/v1/members"))
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").exists())
                .andExpect(jsonPath("$[0].email").exists())
                .andExpect(jsonPath("$[0].name").exists());
    }


    @Test
    @DisplayName("회원 정보 수정")
    @WithMockUser
    void updateMember() throws Exception {
        int memberId = 1;

        ResultActions resultActions = mockMvc
                .perform(
                        put("/api/v1/members/" + memberId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""

                                        {
                                          "name": "수정된 이름",
                                          "phoneNumber": "010-1234-5678"
                                      }
                                      """)
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("수정된 이름"))
                .andExpect(jsonPath("$.phoneNumber").value("010-1234-5678"));
    }

    @Test
    @DisplayName("회원 삭제")
    @WithMockUser(roles = "ADMIN")
    void deleteMember() throws Exception {
        int memberId = 2;

        ResultActions resultActions = mockMvc
                .perform(delete("/api/v1/members/" + memberId))
                .andDo(print());

        resultActions
                .andExpect(status().isNoContent());
    }

}

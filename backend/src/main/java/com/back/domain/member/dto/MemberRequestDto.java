package com.back.domain.member.dto;

import com.back.domain.member.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record MemberRequestDto(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 8, max = 16) String password,
        @NotBlank @Size(min = 2, max = 20) String name,
        String phoneNumber
) {

    // 암호화된 비밀번호를 사용하여 Member 엔티티로 변환하는 메서드
    public Member toEntity(String encodedPassword) {
        return Member.builder()
                .email(email)
                .password(encodedPassword) // 암호화된 비밀번호 사용
                .name(name)
                .phoneNumber(phoneNumber)
                .build();
    }

    public MemberRequestDto {

    }
}
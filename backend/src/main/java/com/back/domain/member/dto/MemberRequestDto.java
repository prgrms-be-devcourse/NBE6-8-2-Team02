package com.back.domain.member.dto;

import com.back.domain.member.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public record MemberRequestDto(
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        @NotBlank(message = "이메일은 필수입니다.")
        String email,

        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 8, max = 20, message = "비밀번호는 8~20자 사이여야 합니다.")
        String password,

        @NotBlank(message = "이름은 필수입니다.")
        @Size(min = 2, max = 20, message = "이름은 2~20자 사이여야 합니다.")
        String name,

        @Pattern(regexp = "^\\d{2,4}-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)")
        String phoneNumber
) {

    // MemberRequestDto에 추가:
    public Member toEntity() {
        return Member.builder()
                .email(email)
                .password(password) // 원본 비밀번호 (연습용)
                .name(name)
                .phoneNumber(phoneNumber)
                .build();
    }

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
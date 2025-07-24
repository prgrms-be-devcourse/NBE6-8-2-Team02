package com.back.domain.auth.dto;

import com.back.domain.member.entity.Member;

public record LoginResponseDto(
    String accessToken,
    String tokenType,
    long expiresIn,
    int userId,
    String email,
    String name,
    Member.MemberRole role
) {

    public static LoginResponseDto of(String accessToken, long expiresIn, Member member) {
        return new LoginResponseDto(
                accessToken,
                "Bearer",
                expiresIn,
                member.getId(),
                member.getEmail(),
                member.getName(),
                member.getRole()
        );
    }
}

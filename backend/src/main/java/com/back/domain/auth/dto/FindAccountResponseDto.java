package com.back.domain.auth.dto;

import com.back.domain.member.entity.Member;

public record FindAccountResponseDto(
        String email,
        String name
) {
    public static FindAccountResponseDto from(Member member) {
        return new FindAccountResponseDto(
                member.getEmail(),
                member.getName()
        );
    }
}

package com.back.domain.member.dto;

public record MemberDeleteResponseDto(
        boolean success
) {
    public static MemberDeleteResponseDto of(boolean success) {
        return new MemberDeleteResponseDto(success);
    }
}
package com.back.domain.member.dto;

import com.back.domain.member.entity.Member;

public record MemberResponseDto(
        int id, //
        String email,
        String name,
        String phoneNumber,
        String role

) {
    // Member 엔티티를 받아서 MemberResponseDto를 생성하는 팩토리 메서드
    public static MemberResponseDto from(Member member) {
        return new MemberResponseDto(
                member.getId(),
                member.getEmail(),
                member.getName(),
                member.getPhoneNumber(),
                member.getRole().name()
        );
    }
}
package com.back.domain.member.dto;

import com.back.domain.member.entity.Member;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AdminMemberDto(
        int id,
        String maskedEmail,     // k***@gmail.com
        String maskedName,      // 김**
        String maskedPhone,     // 010-****-1234
        String status,          // ACTIVE, INACTIVE
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static AdminMemberDto from(Member member) {
        return AdminMemberDto.builder()
                .id(member.getId())
                .maskedEmail(maskEmail(member.getEmail()))
                .maskedName(maskName(member.getName()))
                .maskedPhone(maskPhone(member.getPhoneNumber()))
                .status(member.isActive() ? "ACTIVE" : "INACTIVE")
                .createdAt(member.getCreateDate())
                .updatedAt(member.getModifyDate())
                .build();
    }

    // 이메일 마스킹: test@example.com -> t***@example.com
    private static String maskEmail(String email) {
        if (email == null || email.length() < 3) return "***";

        int atIndex = email.indexOf('@');
        if (atIndex <= 1) return "***" + email.substring(atIndex);

        return email.charAt(0) + "***" + email.substring(atIndex);
    }

    // 이름 마스킹: 김철수 -> 김**
    private static String maskName(String name) {
        if (name == null || name.length() < 2) return "**";
        return name.charAt(0) + "*".repeat(name.length() - 1);
    }

    // 전화번호 마스킹: 010-1234-5678 -> 010-****-5678
    private static String maskPhone(String phone) {
        if (phone == null || phone.length() < 8) return "***-****-****";

        // 010-1234-5678 형태라고 가정
        if (phone.contains("-")) {
            String[] parts = phone.split("-");
            if (parts.length == 3) {
                return parts[0] + "-****-" + parts[2];
            }
        }

        return "***-****-****";
    }
}

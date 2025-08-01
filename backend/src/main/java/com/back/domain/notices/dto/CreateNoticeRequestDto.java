package com.back.domain.notices.dto;

public record CreateNoticeRequestDto(
    String title ,
    String content ,
    String fileUrl
) { 
    public CreateNoticeRequestDto {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("제목은 필수입니다.");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("내용은 필수입니다.");
        }
        // fileUrl은 null이면 빈 문자열로 처리
    }
    
    // fileUrl이 null이면 빈 문자열 반환하는 메서드
    public String fileUrl() {
        return fileUrl != null ? fileUrl : "";
    }
} 
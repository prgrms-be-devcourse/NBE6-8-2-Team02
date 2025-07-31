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
        if (fileUrl == null) {
            fileUrl = "";  // null을 빈 문자열로 변환
        }
    }
}

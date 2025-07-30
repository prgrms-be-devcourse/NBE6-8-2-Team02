package com.back.domain.notices.dto;

public record UpdateNoticeRequestDto(
    int id,              // 수정할 공지사항 ID (필수)
    String title,        // 제목 (선택사항 - null이면 기존 값 유지)
    String content,      // 내용 (선택사항 - null이면 기존 값 유지)
    String fileUrl       // 파일 URL (선택사항 - null이면 기존 값 유지)
) {
    public UpdateNoticeRequestDto {
        // ID는 반드시 필요
        if (id <= 0) {
            throw new IllegalArgumentException("공지사항 ID는 필수입니다.");
        }
        
        // 최소한 하나의 수정 필드는 있어야 함
        if ((title == null || title.trim().isEmpty()) && 
            (content == null || content.trim().isEmpty()) && 
            (fileUrl == null || fileUrl.trim().isEmpty())) {
            throw new IllegalArgumentException("최소한 하나의 수정 항목은 필요합니다.");
        }
    }
}

package com.back.domain.notices.dto;

public record UpdateNoticeRequestDto(
    String title,        // 제목 (선택사항 - null이면 기존 값 유지)
    String content,      // 내용 (선택사항 - null이면 기존 값 유지)
    String fileUrl       // 파일 URL (선택사항 - null이면 기존 값 유지)
) {
}
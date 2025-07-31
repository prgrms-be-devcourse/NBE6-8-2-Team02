package com.back.domain.notices.dto;

public record UpdateNoticeRequestDto(
    int id,              
    String title,        
    String content,     
    String fileUrl       
) {
    public UpdateNoticeRequestDto {
        // ID는 반드시 필요
        if (id <= 0) {
            throw new IllegalArgumentException("공지사항 ID는 필수입니다.");
        }
    }
}

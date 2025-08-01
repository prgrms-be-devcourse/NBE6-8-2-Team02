package com.back.domain.notices.dto;

import com.back.domain.notices.entity.Notice;
import java.time.LocalDateTime;

public record NoticeResponseDto(
    int id,
    String title,
    String content,
    int views,
    String fileUrl,
    String writerName,
    LocalDateTime createDate,
    LocalDateTime modifyDate
) {

    public static NoticeResponseDto from(Notice notice) {
        return new NoticeResponseDto(
            notice.getId(),
            notice.getTitle(),
            notice.getContent(),
            notice.getViews(),
            notice.getFileUrl(),
            notice.getMember() != null ? notice.getMember().getName() : "Unknown",
            notice.getCreateDate(),
            notice.getModifyDate()
        );
    }
} 
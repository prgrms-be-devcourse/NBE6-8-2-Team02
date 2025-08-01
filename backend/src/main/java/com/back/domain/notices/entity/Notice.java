package com.back.domain.notices.entity;

import com.back.global.jpa.entity.BaseEntity;
import com.back.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Notice extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id",nullable = false)
    private Member member;    // 작성자

    @Column(nullable = false)
    private String title;     // 글제목

    @Column(columnDefinition = "TEXT")
    private String content;   // 글내용

    @Column
    private Integer views = 0;  // 조회수

    @Column
    private String fileUrl;   // 첨부파일

    // 조회수 증가 메서드
    public void incrementViews() {
        this.views++;
    }
}
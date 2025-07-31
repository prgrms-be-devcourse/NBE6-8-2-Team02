package com.back.domain.auth.entity;

import com.back.domain.member.entity.Member;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class RefreshToken extends BaseEntity {

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private boolean isActive;

    @Builder
    public RefreshToken(String token, Member member, LocalDateTime expiryDate) {
        this.token = token;
        this.member = member;
        this.expiryDate = expiryDate;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

    public void updateToken(String newToken, LocalDateTime newExpiryDate) {
        this.token = newToken;
        this.expiryDate = newExpiryDate;
        this.isActive = true; // 토큰을 갱신할 때 활성화 상태로 설정
    }
}

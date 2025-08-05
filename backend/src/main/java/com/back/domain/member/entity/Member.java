package com.back.domain.member.entity;

import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Member extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(length = 20)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberRole role = MemberRole.USER;

    @Column
    private String profileImageUrl;

    @Column
    private boolean isActive = true; // 활성화 상태

    @Column
    private boolean isDeleted = false; // 소프트 삭제 상태

    @Builder
    public Member(String email, String password, String name, String phoneNumber, MemberRole role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.role = role != null ? role : MemberRole.USER; // 기본 역할은 USER
    }

    public void updateProfile(String name, String phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    public void changePassword(String newPassword) {
        this.password = newPassword;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public void activate() {
        this.isActive = true;
    }

    public void softDelete() {
        this.isDeleted = true;
    }

    public enum MemberRole {
        ADMIN, // 관리자
        USER   // 일반 사용자
    }
}

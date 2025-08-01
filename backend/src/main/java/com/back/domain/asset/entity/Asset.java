package com.back.domain.asset.entity;

import com.back.global.jpa.entity.BaseEntity;
import com.back.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset extends BaseEntity {
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; // 연결된 Member

    String name; // 자산 이름

    @Enumerated(EnumType.STRING)
    AssetType assetType; // 자산 유형

    Long assetValue; // 자산 가치

    @Column(nullable = false)
    Boolean status;

    // int id(PK) -> BaseEntity
    // LocalDateTime created_at -> BaseEntity
}

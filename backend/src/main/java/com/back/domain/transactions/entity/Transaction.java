package com.back.domain.transactions.entity;

import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction extends BaseEntity {
    
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Asset asset; // 연결된 자산

    @Enumerated(EnumType.STRING)
    private TransactionType type; // 거래 유형

    private Long amount; // 거래량

    private String content; // 필요 시 메모

    private LocalDateTime date; // 체결일

    // int id(PK) -> BaseEntity
    // LocalDateTime created_at -> BaseEntity
    // LocalDateTime modified_at -> BaseEntity
} 
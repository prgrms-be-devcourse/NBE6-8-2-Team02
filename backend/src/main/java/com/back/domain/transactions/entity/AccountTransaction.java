package com.back.domain.transactions.entity;

import com.back.domain.account.entity.Account;
import com.back.domain.transactions.dto.AccountTransactionDto;
import com.back.domain.transactions.dto.CreateAccTracRequestDto;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class AccountTransaction extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // 거래 유형

    private Long amount; // 거래량
    private String content; // 필요 시 메모
    private LocalDateTime date; // 체결일

    public static AccountTransaction create(CreateAccTracRequestDto dto,Account account) {
        return AccountTransaction.builder()
                .account(account)
                .type(TransactionType.valueOf(dto.type()))
                .amount(dto.amount())
                .content(dto.content())
                .date(LocalDateTime.parse(dto.date()))
                .build();
    }
}

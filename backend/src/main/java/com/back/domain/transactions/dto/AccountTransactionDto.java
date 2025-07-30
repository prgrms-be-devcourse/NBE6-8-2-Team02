package com.back.domain.transactions.dto;

import com.back.domain.transactions.entity.AccountTransaction;

import java.time.LocalDateTime;

public record AccountTransactionDto(
        int id,
        int accountId,
        String type,
        Long amount,
        String content,
        LocalDateTime date,
        LocalDateTime createDate,
        LocalDateTime modifyDate
) {
    public AccountTransactionDto(AccountTransaction accountTransaction) {
        this(
                accountTransaction.getId(),
                accountTransaction.getAccount().getId(),
                accountTransaction.getType().toString(),
                accountTransaction.getAmount(),
                accountTransaction.getContent(),
                accountTransaction.getDate(),
                accountTransaction.getCreateDate(),
                accountTransaction.getModifyDate()
        );
    }
}
package com.back.domain.transactions.dto;

import com.back.domain.transactions.entity.Transaction;

import java.time.LocalDateTime;

public record TransactionDto(
        int id,
        int assetId,
        String type,
        Long amount,
        String content,
        LocalDateTime date,
        LocalDateTime createDate,
        LocalDateTime modifyDate
) {
    public TransactionDto(Transaction transaction) {
        this(
                transaction.getId(),
                transaction.getAsset().getId(),
                transaction.getType().toString(),
                transaction.getAmount(),
                transaction.getContent(),
                transaction.getDate(),
                transaction.getCreateDate(),
                transaction.getModifyDate()
        );
    }
} 
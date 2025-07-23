package com.back.domain.transactions.Dto;

public record CreateTransactionRequestDto(
        int assetId,
        String type,
        int amount,
        String content,
        String date
) {
    public CreateTransactionRequestDto(int assetId, String type, int amount, String content, String date) {
        this.assetId = assetId;
        this.type = type;
        this.amount = amount;
        this.content = content;
        this.date = date;
    }
} 
package com.back.domain.transactions.Dto;

public record UpdateTransactionRequestDto(
        int id,
        String type,
        int amount,
        String content,
        String date
) {
    public UpdateTransactionRequestDto(int id, String type, int amount, String content, String date) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.content = content;
        this.date = date;
    }
} 
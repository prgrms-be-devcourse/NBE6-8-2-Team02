package com.back.domain.transactions.dto;

public record CreateAccTracRequestDto(
        int accountId,
        String type,
        Long amount,
        String content,
        String date
) {
    public CreateAccTracRequestDto(int accountId, String type, Long amount, String content, String date) {
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.content = content;
        this.date = date;
    }
}
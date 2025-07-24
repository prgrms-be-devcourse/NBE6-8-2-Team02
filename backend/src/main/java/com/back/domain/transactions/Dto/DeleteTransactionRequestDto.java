package com.back.domain.transactions.dto;

public record DeleteTransactionRequestDto(
    int id // 삭제할 거래의 고유 번호
) {
    public DeleteTransactionRequestDto(int id) {
        this.id = id;
    }
} 
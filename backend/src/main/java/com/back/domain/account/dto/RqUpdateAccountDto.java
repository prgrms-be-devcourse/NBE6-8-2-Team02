package com.back.domain.account.dto;

import lombok.Getter;

@Getter
public class RqUpdateAccountDto {
    private String accountNumber;

    public RqUpdateAccountDto(String accountNumber) {
        this.accountNumber = accountNumber;
    }
}
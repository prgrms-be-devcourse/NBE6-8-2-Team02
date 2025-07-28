package com.back.domain.account.dto;

import com.back.domain.account.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RqCreateAccountDto {
    private String name;
    private String accountNumber;
    private Long balance;

}

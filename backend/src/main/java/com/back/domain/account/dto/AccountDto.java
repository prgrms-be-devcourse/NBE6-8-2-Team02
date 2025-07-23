package com.back.domain.account.dto;

import com.back.domain.account.entity.Account;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AccountDto {
    private int id;
    private int memberId;
    private String name;
    private  String accountNumber;
    private Long balance;
    private LocalDateTime createDate;
    private LocalDateTime modifyDate;

    public AccountDto(Account account) {
        this.id = account.getId();
        this.memberId = account.getMember().getId();
        this.name = account.getName();
        this.accountNumber = account.getAccountNumber();
        this.balance = account.getBalance();
        this.createDate = account.getCreateDate();
        this.modifyDate = account.getModifyDate();
    }
}

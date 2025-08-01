package com.back.domain.account.exception;

public class AccountNotFoundException extends RuntimeException{
    public AccountNotFoundException() {
        super("해당 계좌가 존재하지 않습니다.");
    }
}

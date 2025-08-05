package com.back.domain.account.exception;

public class AccountDuplicateException extends RuntimeException{
    public AccountDuplicateException(){
        super("이미 존재하는 계좌입니다.");
    }
}

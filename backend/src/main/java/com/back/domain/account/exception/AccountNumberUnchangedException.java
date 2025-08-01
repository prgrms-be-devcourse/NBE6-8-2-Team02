package com.back.domain.account.exception;

public class AccountNumberUnchangedException extends RuntimeException{
    public AccountNumberUnchangedException() {
        super("기존 계좌번호와 동일한 계좌번호로는 수정할 수 없습니다.");
    }
}

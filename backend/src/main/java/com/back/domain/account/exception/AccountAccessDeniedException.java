package com.back.domain.account.exception;

public class AccountAccessDeniedException extends RuntimeException {

    public AccountAccessDeniedException() {
        super("해당 계좌에 대한 권한이 없습니다.");
    }
}

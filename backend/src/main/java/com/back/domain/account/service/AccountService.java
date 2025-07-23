package com.back.domain.account.service;

import com.back.domain.account.dto.RqCreateAccountDto;
import com.back.domain.account.entity.Account;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final MemberRepository memberRepository;

    public Account createAccount(RqCreateAccountDto rqCreateAccountDto) {
        Member member = memberRepository.findById(rqCreateAccountDto.getMemberId()).orElseThrow(()->new IllegalArgumentException("해당 회원이 존재하지 않습니다."));

        Account account= Account.builder()
                .member(member)
                .accountNumber(rqCreateAccountDto.getAccountNumber())
                .name(rqCreateAccountDto.getName())
                .balance(rqCreateAccountDto.getBalance())
                .build();

        return accountRepository.save(account);
    }

    public List<Account> getAcccounts() {
        return accountRepository.findAll();}

    public Account getAccount(int accountId) {
        return accountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("해당 계좌가 존재하지 않습니다. id: " + accountId));
    }

    public Account deleteAccount(int accountId) {
        Account account = getAccount(accountId);

        accountRepository.deleteById(accountId);

        return account;
    }
}

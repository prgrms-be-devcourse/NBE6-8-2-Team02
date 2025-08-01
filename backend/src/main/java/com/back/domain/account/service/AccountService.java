package com.back.domain.account.service;

import com.back.domain.account.dto.RqCreateAccountDto;
import com.back.domain.account.dto.RqUpdateAccountDto;
import com.back.domain.account.entity.Account;
import com.back.domain.account.exception.AccountNotFoundException;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.transactions.entity.TransactionType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final MemberRepository memberRepository;

    public Account createAccount(RqCreateAccountDto rqCreateAccountDto,int memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Account account= Account.builder()
                .member(member)
                .accountNumber(rqCreateAccountDto.getAccountNumber())
                .name(rqCreateAccountDto.getName())
                .balance(rqCreateAccountDto.getBalance())
                .build();

        return accountRepository.save(account);
    }

    public List<Account> getAccountsByMemberId(int memberId) {
        return accountRepository.findAllByMemberId(memberId);
    }

    public Account getAccount(int accountId,int memberId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new AccountNotFoundException(accountId));

        if (account.getMember().getId() != memberId) {
            throw new AccessDeniedException("이 계좌에 접근할 권한이 없습니다.");
        }
        return account;
    }

    @Transactional
    public Account updateAccount(int accountId, int memberId,RqUpdateAccountDto rqUpdateAccountDto){
        Account account = getAccount(accountId,memberId);

        account.setAccountNumber(rqUpdateAccountDto.getAccountNumber());

        return account;
    }

    @Transactional
    public void deleteAccount(int accountId,int memberId) {

        Account account = getAccount(accountId, memberId);
        account.setDeleted(true);
    }

}

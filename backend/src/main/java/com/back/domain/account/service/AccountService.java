package com.back.domain.account.service;

import com.back.domain.account.dto.RqCreateAccountDto;
import com.back.domain.account.dto.RqUpdateAccountDto;
import com.back.domain.account.entity.Account;
import com.back.domain.account.exception.AccountAccessDeniedException;
import com.back.domain.account.exception.AccountDuplicateException;
import com.back.domain.account.exception.AccountNotFoundException;
import com.back.domain.account.exception.AccountNumberUnchangedException;
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

    public Account createAccount(RqCreateAccountDto rqCreateAccountDto,Member member) {

        if(accountRepository.existsAccountByAccountNumberAndName(
                rqCreateAccountDto.getAccountNumber(),
                rqCreateAccountDto.getName()
        )){
            throw new AccountDuplicateException();
        }

        Account account = Account.builder()
                .name(rqCreateAccountDto.getName())
                .accountNumber(rqCreateAccountDto.getAccountNumber())
                .balance(rqCreateAccountDto.getBalance())
                .member(member)
                .build();

        return accountRepository.save(account);
    }

    public List<Account> getAccountsByMemberId(Member member) {
        return accountRepository.findAllByMemberId(member.getId());
    }

    public Account getAccount(int accountId,Member member) {
        Account account = accountRepository.findById(accountId).orElseThrow(()->{
            throw new AccountNotFoundException();
        });
        if (account.getMember().getId() != member.getId()) {
            throw new AccountAccessDeniedException();
        }
        return account;
    }

    @Transactional
    public void updateAccount(int accountId, Member member, RqUpdateAccountDto rqUpdateAccountDto) {
        Account account = getAccount(accountId, member);

        if(account.getAccountNumber().equals(rqUpdateAccountDto.getAccountNumber())){
            throw new AccountNumberUnchangedException();
        }

        account.setAccountNumber(rqUpdateAccountDto.getAccountNumber());
    }

    @Transactional
    public void deleteAccount(int accountId,Member member) {
        Account account = getAccount(accountId, member);

        account.setDeleted(true);
    }

}

package com.back.domain.account.service;

import com.back.domain.account.dto.RqCreateAccountDto;
import com.back.domain.account.dto.RqUpdateAccountDto;
import com.back.domain.account.entity.Account;
import com.back.domain.account.exception.AccountDuplicateException;
import com.back.domain.account.exception.AccountNotFoundException;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    private void checkAccountDuplicate (RqCreateAccountDto rqCreateAccountDto){
        if(accountRepository.existsAccountByAccountNumberAndName(
                rqCreateAccountDto.getAccountNumber(),
                rqCreateAccountDto.getName()
        )){
            throw new AccountDuplicateException();
        }
    }

    private Account findByAccount(int accountId) {
        return accountRepository.findById(accountId).orElseThrow(() -> {
            throw new AccountNotFoundException();
        });
    }

    public Account createAccount(RqCreateAccountDto rqCreateAccountDto,Member member) {
        checkAccountDuplicate(rqCreateAccountDto);
        Account account = Account.create(rqCreateAccountDto,member);

        return accountRepository.save(account);
    }

    public List<Account> getAccountsByMemberId(Member member) {
        return accountRepository.findAllByMemberId(member.getId());
    }

    public Account getAccount(int accountId,Member member) {
        Account account = findByAccount(accountId);
        account.validateOwner(member);

        return account;
    }

    @Transactional
    public void updateAccount(int accountId, Member member, RqUpdateAccountDto rqUpdateAccountDto) {
        Account account = getAccount(accountId, member);
        account.updateAccountNumber(rqUpdateAccountDto.getAccountNumber());
    }

    @Transactional
    public void deleteAccount(int accountId,Member member) {
        Account account = getAccount(accountId, member);
        account.deleteAccount();
    }

}

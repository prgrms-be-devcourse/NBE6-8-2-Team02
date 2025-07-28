package com.back.domain.transactions.service;

import com.back.domain.account.entity.Account;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.transactions.Dto.CreateAccTracRequestDto;
import com.back.domain.transactions.entity.AccountTransaction;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.repository.AccountTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountTransactionService {
    private final AccountTransactionRepository accountTransactionRepository;
    private final AccountRepository accountRepository;

    // 거래 생성
    public AccountTransaction createAccountTransaction(CreateAccTracRequestDto dto) {
        Account account = accountRepository.findById(dto.accountId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 자산입니다."));

        AccountTransaction accountTransaction = AccountTransaction.builder()
                .account(account)
                .type(TransactionType.valueOf(dto.type()))
                .amount(dto.amount())
                .content(dto.content())
                .date(LocalDateTime.parse(dto.date()))
                .build();

        return accountTransactionRepository.save(accountTransaction);
    }

    public List<AccountTransaction> findByAccountId(int accountId) {
        // 자산이 존재하는지 확인
        accountRepository.findById(accountId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 자산입니다. id: " + accountId));

        return accountTransactionRepository.findByAccountId(accountId);
    }

    // ------- 일반 서비스 -------- //
    public long count() { return accountTransactionRepository.count();}
    public void flush() { accountTransactionRepository.flush();}
    public AccountTransaction deleteById(int id) {
        AccountTransaction accountTransaction = accountTransactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 id의 거래가 없습니다. id:" + id));
        accountTransactionRepository.deleteById(id);
        return accountTransaction;
    }
    public List<AccountTransaction> findAll() { return accountTransactionRepository.findAll();}
    public Optional<AccountTransaction> findById(int id) { return accountTransactionRepository.findById(id);}
}
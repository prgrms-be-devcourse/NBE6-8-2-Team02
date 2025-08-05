package com.back.domain.transactions.service;

import com.back.domain.account.entity.Account;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.account.service.AccountService;
import com.back.domain.member.entity.Member;
import com.back.domain.transactions.dto.AccountTransactionDto;
import com.back.domain.transactions.dto.CreateAccTracRequestDto;
import com.back.domain.transactions.dto.TransactionDto;
import com.back.domain.transactions.entity.AccountTransaction;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.repository.AccountTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountTransactionService {
    private final AccountTransactionRepository accountTransactionRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    // 거래 생성
    @Transactional
    public AccountTransaction createAccountTransaction(CreateAccTracRequestDto dto, Member member) {
        Account account = accountService.getAccount(dto.accountId(),member);
        AccountTransaction accTrans = AccountTransaction.create(dto, account);

        accountTransactionRepository.save(accTrans);
        account.updateBalance(TransactionType.valueOf(dto.type()), dto.amount());

        return accTrans;
    }

    public List<AccountTransaction> findByAccountId(int accountId,Member member) {
        // 자산이 존재하는지 확인
        Account account = accountService.getAccount(accountId,member);

        return accountTransactionRepository.findByAccount_Id(accountId);
    }

    // ------- 일반 서비스 -------- //
    @Transactional(readOnly = true)
    public long count() { return accountTransactionRepository.count();}

    public void flush() { accountTransactionRepository.flush();}

    @Transactional
    public AccountTransaction deleteById(int id) {
        AccountTransaction accountTransaction = accountTransactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 id의 거래가 없습니다. id:" + id));
        accountTransactionRepository.deleteById(id);
        return accountTransaction;
    }

    @Transactional(readOnly = true)
    public List<AccountTransaction> findAll() { return accountTransactionRepository.findAll();}

    @Transactional(readOnly = true)
    public Optional<AccountTransaction> findById(int id) { return accountTransactionRepository.findById(id);}

    // id 목록 기반 조회.
    // 사용 용이하도록 Dto로 return.
    @Transactional(readOnly = true)
    public Map<Integer, List<AccountTransactionDto>> findAccTransactionsByAccountIds(List<Integer> accountIds) {
        List<AccountTransaction> allTransactions = accountTransactionRepository.findByAccount_IdIn(accountIds);

        return allTransactions.stream()
                .collect(Collectors.groupingBy(
                        tx -> tx.getAccount().getId(),
                        Collectors.mapping(AccountTransactionDto::new, Collectors.toList())
                ));
    }
}
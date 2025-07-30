package com.back.domain.transactions.repository;

import com.back.domain.account.entity.Account;
import com.back.domain.transactions.entity.AccountTransaction;
import com.back.domain.transactions.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountTransactionRepository extends JpaRepository<AccountTransaction, Integer> {
    List<AccountTransaction> findByAccount_Id(int accountId);
    List<AccountTransaction> findByAccount_IdIn(List<Integer> accountIds);
}

package com.back.domain.account.repository;

import com.back.domain.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,Integer> {
    List<Account> findAllByMemberId(int memberId);
    List<Account> findAllByMemberIdAndIsDeletedFalse(int memberId);
    boolean existsAccountByAccountNumberAndName(String accountNumber,String name);
}

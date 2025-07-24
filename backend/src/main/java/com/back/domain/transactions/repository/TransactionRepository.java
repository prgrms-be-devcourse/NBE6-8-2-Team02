package com.back.domain.transactions.repository;

import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    
    // 특정 자산의 거래 목록 조회
    List<Transaction> findByAssetId(int assetId);
    
    // 특정 계좌의 거래 목록 조회 (Asset을 통해 Account 연결)
    @Query("SELECT t FROM Transaction t JOIN t.asset a WHERE a.member.id = :accountId")
    List<Transaction> findByAccountId(@Param("accountId") int accountId);
    
    // 거래 검색 및 필터링
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:startDate IS NULL OR t.date >= :startDate) AND " +
           "(:endDate IS NULL OR t.date <= :endDate) AND " +
           "(:minAmount IS NULL OR t.amount >= :minAmount) AND " +
           "(:maxAmount IS NULL OR t.amount <= :maxAmount) " +
           "ORDER BY t.date DESC")
    List<Transaction> searchTransactions(
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("minAmount") Integer minAmount,
            @Param("maxAmount") Integer maxAmount
    );
} 
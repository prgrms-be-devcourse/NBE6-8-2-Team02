package com.back.domain.transactions.service;

import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.transactions.dto.CreateTransactionRequestDto;
import com.back.domain.transactions.dto.UpdateTransactionRequestDto;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AssetRepository assetRepository;
    private final AccountRepository accountRepository;

    // 거래 생성
    public Transaction createTransaction(CreateTransactionRequestDto dto) {
        Asset asset = assetRepository.findById(dto.assetId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 자산입니다."));

        Transaction transaction = Transaction.builder()
                .asset(asset)
                .type(TransactionType.valueOf(dto.type()))
                .amount(dto.amount())
                .content(dto.content())
                .date(LocalDateTime.parse(dto.date()))
                .build();

        return transactionRepository.save(transaction);
    }


    // 거래 전체 조회
    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    // 거래 단건 조회
    public Optional<Transaction> findById(int id) {
        return transactionRepository.findById(id);
    }

    // 거래 삭제
    public Transaction deleteById(int id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 id의 거래가 없습니다. id:" + id));
        transactionRepository.deleteById(id);
        return transaction;
    }

    // 거래 수정
    public Transaction updateById(UpdateTransactionRequestDto dto) {
        Transaction transaction = transactionRepository.findById(dto.id())
                .orElseThrow(() -> new IllegalArgumentException("해당 id의 거래가 없습니다. id:" + dto.id()));

        transaction.setType(TransactionType.valueOf(dto.type()));
        transaction.setAmount(dto.amount());
        transaction.setContent(dto.content());
        transaction.setDate(LocalDateTime.parse(dto.date()));

        return transactionRepository.save(transaction);
    }

    // 특정 자산의 거래 목록 조회
    public List<Transaction> findByAssetId(int assetId) {
        // 자산이 존재하는지 확인
        assetRepository.findById(assetId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 자산입니다. id: " + assetId));
        
        return transactionRepository.findByAssetId(assetId);
    }

    // 특정 계좌의 거래 목록 조회
    public List<Transaction> findByAccountId(int accountId) {
        // 계좌가 존재하는지 확인
        accountRepository.findById(accountId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 계좌입니다. id: " + accountId));
        
        return transactionRepository.findByAccountId(accountId);
    }

    // 거래 검색 및 필터링
    public List<Transaction> searchTransactions(String type, String startDate, String endDate, 
                                               Integer minAmount, Integer maxAmount) {
        LocalDateTime start = null;
        LocalDateTime end = null;
        
        if (startDate != null && !startDate.isEmpty()) {
            start = LocalDateTime.parse(startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            end = LocalDateTime.parse(endDate);
        }
        
        TransactionType transactionType = null;
        if (type != null && !type.isEmpty()) {
            try {
                transactionType = TransactionType.valueOf(type);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("유효하지 않은 거래 유형입니다: " + type);
            }
        }
        
        return transactionRepository.searchTransactions(transactionType, start, end, minAmount, maxAmount);
    }
} 
package com.back.domain.transactions.service;

import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.transactions.Dto.CreateTransactionRequestDto;
import com.back.domain.transactions.Dto.UpdateTransactionRequestDto;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AssetRepository assetRepository;

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
} 
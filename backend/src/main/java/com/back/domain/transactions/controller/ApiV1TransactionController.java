package com.back.domain.transactions.controller;

import com.back.domain.transactions.dto.CreateTransactionRequestDto;
import com.back.domain.transactions.dto.TransactionDto;
import com.back.domain.transactions.dto.UpdateTransactionRequestDto;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.service.TransactionService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/transactions/asset")
@Tag(name = "Transactions", description = "거래 컨트롤러")
public class ApiV1TransactionController {
    private final TransactionService transactionService;

    // 거래 등록
    @PostMapping
    @Operation(summary = "거래 등록")
    public RsData<TransactionDto> createTransaction(
            @RequestBody CreateTransactionRequestDto createTransactionRequestDto
    ) {
        Transaction transaction = transactionService.createTransaction(createTransactionRequestDto);
        TransactionDto transactionDto = new TransactionDto(transaction);
        return new RsData<>("200-1", "거래가 등록되었습니다.", transactionDto);
    }

    // 거래 목록 조회
    @GetMapping
    @Operation(summary = "거래 목록 조회")
    public RsData<List<TransactionDto>> getTransactions() {
        List<Transaction> transactions = transactionService.findAll();
        List<TransactionDto> transactionDtos = transactions.stream().map(TransactionDto::new).toList();
        return new RsData<>("200-1", "거래 목록을 조회했습니다.", transactionDtos);
    }

    // 거래 단건 조회
    @GetMapping("/{id}")
    @Operation(summary = "거래 단건 조회")
    public RsData<TransactionDto> getTransaction(@PathVariable int id) {
        Transaction transaction = transactionService.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 id의 거래가 없습니다. id: " + id));
        TransactionDto transactionDto = new TransactionDto(transaction);
        return new RsData<>("200-1", id + "번 거래를 조회했습니다.", transactionDto);
    }

    // 거래 삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "거래 삭제")
    public RsData<TransactionDto> deleteTransaction(@PathVariable int id) {
        Transaction transaction = transactionService.deleteById(id);
        TransactionDto transactionDto = new TransactionDto(transaction);
        return new RsData<>("200-1", id + "번 거래를 삭제했습니다.", transactionDto);
    }

    // 거래 수정
    @PutMapping("/{id}")
    @Operation(summary = "거래 수정")
    public RsData<TransactionDto> updateTransaction(@RequestBody UpdateTransactionRequestDto updateTransactionRequestDto) {
        Transaction transaction = transactionService.updateById(updateTransactionRequestDto);
        TransactionDto transactionDto = new TransactionDto(transaction);
        return new RsData<>("200-1", updateTransactionRequestDto.id() + "번 거래를 수정했습니다.", transactionDto);
    }

    // 특정 자산의 거래 목록 조회
    @GetMapping("/search/{assetId}")
    @Operation(summary = "특정 자산의 거래 목록 조회")
    public RsData<List<TransactionDto>> getTransactionsByAsset(@PathVariable int assetId) {
        List<Transaction> transactions = transactionService.findByAssetId(assetId);
        List<TransactionDto> transactionDtos = transactions.stream().map(TransactionDto::new).toList();
        return new RsData<>("200-1", assetId + "번 자산의 거래 목록을 조회했습니다.", transactionDtos);
    }

    @GetMapping("/search/bulk")
    @Operation(summary = "자산 거래 목록 일괄 조회")
    public RsData<Map<Integer, List<TransactionDto>>> getTransactionsBulk(@RequestParam List<Integer> ids) {
        Map<Integer, List<TransactionDto>> result = transactionService.findTransactionsByAssetIds(ids);
        return new RsData<>("200-1", "자산 거래를 일괄 조회했습니다.", result);
    }
} 
package com.back.domain.transactions.controller;

import com.back.domain.account.entity.Account;
import com.back.domain.transactions.dto.AccountTransactionDto;
import com.back.domain.transactions.dto.CreateAccTracRequestDto;
import com.back.domain.transactions.dto.TransactionDto;
import com.back.domain.transactions.entity.AccountTransaction;
import com.back.domain.transactions.service.AccountTransactionService;
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
@RequestMapping("/api/v1/transactions/account")
@Tag(name = "AccountTransactions", description = "거래(계좌) 컨트롤러")
public class ApiV1AccountTransactionController {
    private final AccountTransactionService acctTransactionService;

    // 거래 등록
    @PostMapping
    @Operation(summary = "거래 등록")
    public RsData<AccountTransactionDto> createTransaction(
            @RequestBody CreateAccTracRequestDto createAccTracRequestDto
            ) {
        AccountTransaction accountTransaction = acctTransactionService.createAccountTransaction(createAccTracRequestDto);
        AccountTransactionDto accountTransactionDto = new AccountTransactionDto(accountTransaction);
        return new RsData<>("200-1", "거래가 등록되었습니다.", accountTransactionDto);
    }

    // 거래 목록 조회
    @GetMapping
    @Operation(summary = "거래 목록 조회")
    public RsData<List<AccountTransactionDto>> getTransactions() {
        List<AccountTransaction> accountTransactions = acctTransactionService.findAll();
        List<AccountTransactionDto> accountTransactionDtos = accountTransactions.stream().map(AccountTransactionDto::new).toList();
        return new RsData<>("200-1", "거래 목록을 조회했습니다.", accountTransactionDtos);
    }

    // 거래 단건 조회
    @GetMapping("/{id}")
    @Operation(summary = "거래 단건 조회")
    public RsData<AccountTransactionDto> getTransaction(@PathVariable int id) {
        AccountTransaction accountTransaction = acctTransactionService.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 id의 거래가 없습니다. id: " + id));
        AccountTransactionDto accountTransactionDto = new AccountTransactionDto(accountTransaction);
        return new RsData<>("200-1", id + "번 거래를 조회했습니다.", accountTransactionDto);
    }

    // 거래 삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "거래 삭제")
    public RsData<AccountTransactionDto> deleteTransaction(@PathVariable int id) {
        AccountTransaction accountTransaction = acctTransactionService.deleteById(id);
        AccountTransactionDto accountTransactionDto = new AccountTransactionDto(accountTransaction);
        return new RsData<>("200-1", id + "번 거래를 삭제했습니다.", accountTransactionDto);
    }

    // 특정 계좌의 거래 목록 조회
    @GetMapping("/search/{accountId}")
    @Operation(summary = "특정 계좌의 거래 목록 조회")
    public RsData<List<AccountTransactionDto>> getTransactionsByAccount(@PathVariable int accountId) {
        List<AccountTransaction> accountTransactions = acctTransactionService.findByAccountId(accountId);
        List<AccountTransactionDto> accountTransactionDtos = accountTransactions.stream().map(AccountTransactionDto::new).toList();
        return new RsData<>("200-1", accountId + "번 계좌의 거래 목록을 조회했습니다.", accountTransactionDtos);
    }

    @GetMapping("/search/bulk")
    @Operation(summary = "계좌 거래 목록 일괄 조회")
    public RsData<Map<Integer, List<AccountTransactionDto>>> getAccTransactionsBulk(@RequestParam List<Integer> ids) {
        Map<Integer, List<AccountTransactionDto>> result = acctTransactionService.findAccTransactionsByAccountIds(ids);
        return new RsData<>("200-1", "계좌 거래를 일괄 조회했습니다.", result);
    }
}
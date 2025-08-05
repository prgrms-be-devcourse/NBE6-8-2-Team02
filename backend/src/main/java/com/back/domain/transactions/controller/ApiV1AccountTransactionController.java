package com.back.domain.transactions.controller;

import com.back.domain.account.entity.Account;
import com.back.domain.member.entity.Member;
import com.back.domain.transactions.dto.AccountTransactionDto;
import com.back.domain.transactions.dto.CreateAccTracRequestDto;
import com.back.domain.transactions.dto.TransactionDto;
import com.back.domain.transactions.entity.AccountTransaction;
import com.back.domain.transactions.service.AccountTransactionService;
import com.back.global.rsData.RsData;
import com.back.global.security.jwt.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<AccountTransactionDto> createTransaction(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CreateAccTracRequestDto createAccTracRequestDto
            ) {
        Member member=userDetails.getMember();
        AccountTransaction accountTransaction = acctTransactionService.createAccountTransaction(createAccTracRequestDto,member);
        AccountTransactionDto accountTransactionDto = new AccountTransactionDto(accountTransaction);
        return ResponseEntity.status(201).body(accountTransactionDto);
    }

    // 거래 목록 조회
    @GetMapping
    @Operation(summary = "거래 목록 조회")
    public ResponseEntity<List<AccountTransactionDto>> getTransactions() {
        List<AccountTransaction> accountTransactions = acctTransactionService.findAll();
        List<AccountTransactionDto> accountTransactionDtos = accountTransactions.stream().map(AccountTransactionDto::new).toList();
        return ResponseEntity.ok(accountTransactionDtos);
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
    public ResponseEntity<List<AccountTransactionDto>> getTransactionsByAccount(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable int accountId) {
        Member member = userDetails.getMember();
        List<AccountTransaction> accountTransactions = acctTransactionService.findByAccountId(accountId,member);
        List<AccountTransactionDto> accountTransactionDtos = accountTransactions.stream().map(AccountTransactionDto::new).toList();
        return ResponseEntity.ok(accountTransactionDtos);
    }

    @GetMapping("/search/bulk")
    @Operation(summary = "계좌 거래 목록 일괄 조회")
    public RsData<Map<Integer, List<AccountTransactionDto>>> getAccTransactionsBulk(@RequestParam List<Integer> ids) {
        Map<Integer, List<AccountTransactionDto>> result = acctTransactionService.findAccTransactionsByAccountIds(ids);
        return new RsData<>("200-1", "계좌 거래를 일괄 조회했습니다.", result);
    }
}
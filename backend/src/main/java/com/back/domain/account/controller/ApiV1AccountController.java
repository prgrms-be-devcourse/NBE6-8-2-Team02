package com.back.domain.account.controller;

import com.back.domain.account.dto.AccountDto;
import com.back.domain.account.dto.RqCreateAccountDto;
import com.back.domain.account.dto.RqUpdateAccountDto;
import com.back.domain.account.entity.Account;
import com.back.domain.account.service.AccountService;
import com.back.domain.member.entity.Member;
import com.back.global.rsData.RsData;
import com.back.global.security.jwt.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/accounts")
@Tag(name = "Account", description = "계좌 컨트롤러")
public class ApiV1AccountController {

    private final AccountService accountService;

    @PostMapping
    @Operation(summary = "계좌 등록" , description = "새로운 계좌 등록")
    public ResponseEntity<AccountDto> createAccount(@AuthenticationPrincipal CustomUserDetails userDetails,@RequestBody RqCreateAccountDto rqCreateAccountDto) {
        Member member = userDetails.getMember();

        Account account = accountService.createAccount(rqCreateAccountDto,member);
        AccountDto accountDto= new AccountDto(account);

        return ResponseEntity.status(CREATED).body(accountDto);
    }

    @GetMapping
    @Operation(summary = "계좌 다건 조회", description = "계좌 다건 조회")
    public ResponseEntity<List<AccountDto>> getAccunts(@AuthenticationPrincipal CustomUserDetails userDetails){
        Member member=userDetails.getMember();

        List<Account> accounts=accountService.getAccountsByMemberId(member.getId());
        List<AccountDto> accountDtos = accounts.stream().map(AccountDto::new).toList();

        return ResponseEntity.status(OK).body(accountDtos);
    }

    @GetMapping("/{accountId}")
    @Operation(summary = "계좌 단건 조회", description = "계좌 단건 조회")
    public ResponseEntity<AccountDto> getAccount(@AuthenticationPrincipal CustomUserDetails userDetails,@PathVariable int accountId){
        Member member= userDetails.getMember();

        Account account =accountService.getAccount(accountId, member);
        AccountDto accountDto = new AccountDto(account);

        return ResponseEntity.status(OK).body(accountDto);
    }

    @PutMapping("/{accountId}")
    @Operation(summary = "계좌 수정", description = "계좌 수정")
    public ResponseEntity<Void> updateAccount(@AuthenticationPrincipal CustomUserDetails userDetails,@PathVariable int accountId,@RequestBody RqUpdateAccountDto rqUpdateAccountDto){
        Member member = userDetails.getMember();
        accountService.updateAccount(accountId, member,rqUpdateAccountDto);

        return ResponseEntity.status(NO_CONTENT).build();
    }

    @DeleteMapping("/{accountId}")
    @Operation(summary = "계좌 삭제", description = "계좌 삭제")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable int accountId){
        Member member = userDetails.getMember();
        accountService.deleteAccount(accountId,member);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}

package com.back.domain.account.controller;

import com.back.domain.account.dto.AccountDto;
import com.back.domain.account.dto.RqCreateAccountDto;
import com.back.domain.account.dto.RqUpdateAccountDto;
import com.back.domain.account.entity.Account;
import com.back.domain.account.service.AccountService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/accounts")
@Tag(name = "Account", description = "계좌 컨트롤러")
public class ApiV1AccountController {

    private final AccountService accountService;

    @PostMapping
    @Operation(summary = "계좌 등록" , description = "새로운 계좌 등록")
    public RsData<AccountDto> createAccount(@RequestBody RqCreateAccountDto rqCreateAccountDto) {

        Account account = accountService.createAccount(rqCreateAccountDto);
        AccountDto accountDto= new AccountDto(account);

        return new RsData("200-1", "계좌가 등록되었습니다.",accountDto);
    }

    @GetMapping
    @Operation(summary = "계좌 다건 조회", description = "계좌 다건 조회")
    public RsData<List<AccountDto>> getAccunts(){
        List<Account> accounts=accountService.getAccounts();
        List<AccountDto> accountDtos = accounts.stream().map(AccountDto::new).toList();

        return new
                RsData<>("200-1", "계좌 목록을 조회했습니다.", accountDtos);
    }


    @GetMapping("/{accountId}")
    @Operation(summary = "계좌 단건 조회", description = "계좌 단건 조회")
    public RsData<AccountDto> getAccount(@PathVariable int accountId){
        Account account =accountService.getAccount(accountId);
        AccountDto accountDto = new AccountDto(account);

        return new RsData<>("200-1", "%d번 계좌를 조회했습니다.".formatted(accountId), accountDto);
    }

    @PutMapping("/{accountId}")
    @Operation(summary = "계좌 수정", description = "계좌 수정")
    public RsData<AccountDto> updateAccount(@PathVariable int accountId,@RequestBody RqUpdateAccountDto rqUpdateAccountDto){
        Account account = accountService.updateAccount(accountId, rqUpdateAccountDto);
        AccountDto accountDto = new AccountDto(account);

        return new RsData<>("200-1", "%d번 계좌가 수정되었습니다.".formatted(accountId), accountDto);
    }

    @DeleteMapping("/{accountId}")
    @Operation(summary = "계좌 삭제", description = "계좌 삭제")
    public RsData<AccountDto> deleteAccount(@PathVariable int accountId){
        Account account = accountService.deleteAccount(accountId);
        AccountDto accountDto=new AccountDto(account);

        return new RsData<>("200-1","%d번 계좌가 삭제되었습니다.".formatted(accountId), accountDto);
    }
}

package com.back.domain.account.entity;

import com.back.domain.member.entity.Member;
import com.back.domain.transactions.entity.TransactionType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class AccountTest {

    @Test
    @DisplayName("계좌 잔액 업데이트")
    void createAccountTransaction() {
        Member member = new Member("test@example.com","111","test1","01012345678", Member.MemberRole.USER);
        Account account=Account.builder()
                .accountNumber("111")
                .member(member)
                .balance(10000L)
                .name("농협")
                .build();

        //입금
        Long balance1 = account.updateBalance(TransactionType.ADD, 5000L).getBalance();
        assertThat(balance1).isEqualTo(15000L);

        //출금
        Long balance2 = account.updateBalance(TransactionType.REMOVE, 5000L).getBalance();
        assertThat(balance2).isEqualTo(10000L);

        //잔액 부족 예외
        assertThrows(IllegalArgumentException.class, () -> {
            account.updateBalance(TransactionType.REMOVE, 20000L);
        });
    }
}

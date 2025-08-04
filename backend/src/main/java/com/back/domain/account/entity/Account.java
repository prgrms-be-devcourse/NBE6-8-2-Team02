package com.back.domain.account.entity;

import com.back.domain.member.entity.Member;
import com.back.domain.transactions.entity.TransactionType;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Account extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private Member member;
    private String accountNumber;
    private Long balance;
    private String name;
    private boolean isDeleted; // 계좌 삭제 여부

    public Account(Member member, String accountNumber, Long balance, String name) {
        this.member = member;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.name = name;
        this.isDeleted = false; // 기본값은 false로 설정
    }

    public Account updateBalance(TransactionType  type, Long amount){
        if(type==TransactionType.ADD){
            this.setBalance(this.getBalance()+amount);
        }else if(type==TransactionType.REMOVE){
            if(getBalance()<amount){
                throw new IllegalArgumentException("잔액이 부족합니다.");
            }
            this.setBalance(this.getBalance()-amount);
        }
        return this;
    }

    public boolean isOwner(Member member) {
        return this.member.equals(member);
    }
}

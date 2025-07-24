package com.back.global.initData;

import com.back.domain.account.entity.Account;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.repository.GoalRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final AssetRepository assetRepository;
    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;

    @Autowired
    @Lazy
    private BaseInitData self;

    private Member[] user;

    @Bean
    ApplicationRunner baseInitDataApplicationRunner() {
        return args -> {
            self.createAuthTestMembers();  // 인증용 테스트 계정들
            self.memberInit();             // 기존 테스트 데이터
            self.accountInit();
            self.assetInit();
            self.transactionInit();
            self.goalInit();
        };
    }

    @Transactional
    public void createAuthTestMembers() {
        // 관리자 계정 생성
        if (!memberRepository.existsByEmail("admin@test.com")) {
            Member admin = Member.builder()
                    .email("admin@test.com")
                    .password(passwordEncoder.encode("admin123"))
                    .name("관리자")
                    .phoneNumber("010-0000-0000")
                    .role(Member.MemberRole.ADMIN)
                    .build();
            memberRepository.save(admin);
            System.out.println("관리자 계정 생성: admin@test.com / admin123");
        }

        // 일반 사용자 계정 생성
        if (!memberRepository.existsByEmail("user@test.com")) {
            Member user = Member.builder()
                    .email("user@test.com")
                    .password(passwordEncoder.encode("user123"))
                    .name("일반사용자")
                    .phoneNumber("010-1111-1111")
                    .role(Member.MemberRole.USER)
                    .build();
            memberRepository.save(user);
            System.out.println("일반 사용자 계정 생성: user@test.com / user123");
        }

        // 테스트용 추가 계정
        if (!memberRepository.existsByEmail("test@example.com")) {
            Member testUser = Member.builder()
                    .email("test@example.com")
                    .password(passwordEncoder.encode("test123"))
                    .name("테스트유저")
                    .phoneNumber("010-2222-2222")
                    .role(Member.MemberRole.USER)
                    .build();
            memberRepository.save(testUser);
            System.out.println("테스트 계정 생성: test@example.com / test123");
        }
    }

    @Transactional
    public void memberInit() {
        // 기존 테스트 데이터가 있으면 건너뛰기
        if(memberRepository.existsByEmail("user1@user.com"))
            return;

        user = new Member[4];

        //유저
        user[1] = new Member("user1@user.com", passwordEncoder.encode("1111"), "유저1", "01011111111", Member.MemberRole.USER);
        user[2] = new Member("user2@user.com", passwordEncoder.encode("2222"), "유저2", "01022222222", Member.MemberRole.USER);
        user[3] = new Member("user3@user.com", passwordEncoder.encode("3333"), "유저3", "01033333333", Member.MemberRole.USER);
        memberRepository.save(user[1]);
        memberRepository.save(user[2]);
        memberRepository.save(user[3]);

        //관리자
        user[0] = new Member("admin@admin.com", passwordEncoder.encode("asdf"), "관리자", "01000000000", Member.MemberRole.ADMIN);
        memberRepository.save(user[0]);
    }

    @Transactional
    public void accountInit() {
        if(accountRepository.count() > 0)
            return;

        //유저1
        accountRepository.save(new Account(user[1], "1-111", (long)10000, "1-계좌1"));
        accountRepository.save(new Account(user[1], "1-222", (long)20000, "1-계좌2"));

        //유저2
        accountRepository.save(new Account(user[2], "2-111", (long)10000, "2-계좌1"));
        accountRepository.save(new Account(user[2], "2-222", (long)20000, "2-계좌2"));

        //유저3
        accountRepository.save(new Account(user[3], "3-111", (long)10000, "3-계좌1"));
        accountRepository.save(new Account(user[3], "3-222", (long)20000, "3-계좌2"));
    }

    @Transactional
    public void assetInit() {
        if(assetRepository.count() > 0)
            return;

        //유저1
        assetRepository.save(new Asset(user[1], "1-예금1", AssetType.DEPOSIT, 10000));
        assetRepository.save(new Asset(user[1], "1-주식1", AssetType.STOCK, 20000));
        assetRepository.save(new Asset(user[1], "1-부동산1", AssetType.REAL_ESTATE, 30000));

        //유저2
        assetRepository.save(new Asset(user[2], "2-예금1", AssetType.DEPOSIT, 10000));
        assetRepository.save(new Asset(user[2], "2-주식1", AssetType.STOCK, 20000));
        assetRepository.save(new Asset(user[2], "2-부동산1", AssetType.REAL_ESTATE, 30000));

        //유저3
        assetRepository.save(new Asset(user[3], "3-예금1", AssetType.DEPOSIT, 10000));
        assetRepository.save(new Asset(user[3], "3-주식1", AssetType.STOCK, 20000));
        assetRepository.save(new Asset(user[3], "3-부동산1", AssetType.REAL_ESTATE, 30000));
    }

    @Transactional
    public void transactionInit() {
        if(transactionRepository.count() > 0)
            return;

        //유저1
        Asset asset1 = assetRepository.findById(1).get();
        transactionRepository.save(new Transaction(asset1, TransactionType.DEPOSIT, 1000, "1입금", LocalDateTime.of(2100, 1, 1, 0, 0, 0)));

        //유저1
        Asset asset2 = assetRepository.findById(4).get();
        transactionRepository.save(new Transaction(asset2, TransactionType.DEPOSIT, 1000, "2입금", LocalDateTime.of(2100, 1, 1, 0, 0, 0)));

        //유저1
        Asset asset3 = assetRepository.findById(7).get();
        transactionRepository.save(new Transaction(asset3, TransactionType.DEPOSIT, 1000, "3입금", LocalDateTime.of(2100, 1, 1, 0, 0, 0)));
    }

    @Transactional
    public void goalInit() {
        if(goalRepository.count() > 0)
            return;

        //유저1
        goalRepository.save(new Goal(user[1], "1-목표1", 10, 1000, LocalDateTime.of(2100, 1, 1, 0, 0, 0)));
        goalRepository.save(new Goal(user[1], "1-목표2", 20, 2000, LocalDateTime.of(2200, 1, 1, 0, 0, 0)));

        //유저2
        goalRepository.save(new Goal(user[2], "2-목표1", 10, 1000, LocalDateTime.of(2100, 1, 1, 0, 0, 0)));
        goalRepository.save(new Goal(user[2], "2-목표2", 20, 2000, LocalDateTime.of(2200, 1, 1, 0, 0, 0)));

        //유저3
        goalRepository.save(new Goal(user[3], "3-목표1", 10, 1000, LocalDateTime.of(2100, 1, 1, 0, 0, 0)));
        goalRepository.save(new Goal(user[3], "3-목표2", 20, 2000, LocalDateTime.of(2200, 1, 1, 0, 0, 0)));
    }
}
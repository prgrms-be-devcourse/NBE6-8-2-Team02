package com.back.global.initData;

import com.back.domain.account.entity.Account;
import com.back.domain.account.repository.AccountRepository;
import com.back.domain.asset.entity.Asset;
import com.back.domain.asset.entity.AssetType;
import com.back.domain.asset.repository.AssetRepository;
import com.back.domain.goal.entity.Goal;
import com.back.domain.goal.repository.GoalRepository;
import com.back.domain.member.entity.Snapshot;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.SnapshotRepository;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.transactions.entity.AccountTransaction;
import com.back.domain.transactions.entity.Transaction;
import com.back.domain.transactions.entity.TransactionType;
import com.back.domain.transactions.repository.AccountTransactionRepository;
import com.back.domain.transactions.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final AssetRepository assetRepository;
    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;
    private final AccountTransactionRepository accountTransactionRepository;
    private final SnapshotRepository snapshotRepository;

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
            self.accountTransactionInit();
            self.snapShotInit();
            self.goalInit();
        };
    }

    @Transactional
    @Profile("!test")
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
    @Profile("!test")
    public void memberInit() {
        // 기존 테스트 데이터가 있으면 건너뛰기
        if(memberRepository.existsByEmail("user1@user.com"))
            return;

        user = new Member[4];

        //유저
        user[1] = new Member("user1@user.com", passwordEncoder.encode("111111"), "유저1", "01011111111", Member.MemberRole.USER);
        user[2] = new Member("user2@user.com", passwordEncoder.encode("222222"), "유저2", "01022222222", Member.MemberRole.USER);
        user[3] = new Member("user3@user.com", passwordEncoder.encode("333333"), "유저3", "01033333333", Member.MemberRole.USER);
        memberRepository.save(user[1]);
        memberRepository.save(user[2]);
        memberRepository.save(user[3]);

        //관리자
        user[0] = new Member("admin@admin.com", passwordEncoder.encode("asd123"), "관리자", "01000000000", Member.MemberRole.ADMIN);
        memberRepository.save(user[0]);
    }

    @Transactional
    @Profile("!test")
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
    @Profile("!test")
    public void assetInit() {
        if(assetRepository.count() > 0)
            return;

        //유저1
        assetRepository.save(new Asset(user[1], "KB 적금", AssetType.DEPOSIT, 140000L));
        assetRepository.save(new Asset(user[1], "KB 예금", AssetType.DEPOSIT, 70000L));
        assetRepository.save(new Asset(user[1], "S-Oil", AssetType.STOCK, 622000L));
        assetRepository.save(new Asset(user[1], "삼성전자", AssetType.STOCK, 704000L));
        assetRepository.save(new Asset(user[1], "SK하이닉스", AssetType.STOCK, 2620000L));
        assetRepository.save(new Asset(user[1], "압구정 현대 (int값 제한..)", AssetType.REAL_ESTATE, 115000000L));
        assetRepository.save(new Asset(user[1], "한남더힐 (int값 제한..)", AssetType.REAL_ESTATE, 100000000L));
        assetRepository.save(new Asset(user[1], "롯데 시그니엘 (int값 제한..)", AssetType.REAL_ESTATE, 70000000L));

        //유저2
        assetRepository.save(new Asset(user[2], "2-예금1", AssetType.DEPOSIT, 10000L));
        assetRepository.save(new Asset(user[2], "2-주식1", AssetType.STOCK, 20000L));
        assetRepository.save(new Asset(user[2], "2-부동산1", AssetType.REAL_ESTATE, 30000L));

        //유저3
        assetRepository.save(new Asset(user[3], "3-예금1", AssetType.DEPOSIT, 10000L));
        assetRepository.save(new Asset(user[3], "3-주식1", AssetType.STOCK, 20000L));
        assetRepository.save(new Asset(user[3], "3-부동산1", AssetType.REAL_ESTATE, 30000L));
    }

    @Transactional
    @Profile("!test")
    public void transactionInit() {
        if(transactionRepository.count() > 0)
            return;

        //유저1
        Asset asset1 = assetRepository.findById(1).get();
        Asset asset2 = assetRepository.findById(4).get();
        Asset asset3 = assetRepository.findById(6).get();
        transactionRepository.save(new Transaction(asset1, TransactionType.ADD, 30000L, "적금 이자", LocalDateTime.of(2025, 7, 23, 0, 0, 0)));
        transactionRepository.save(new Transaction(asset2, TransactionType.REMOVE, 12000L, "주가 하락", LocalDateTime.of(2025, 7, 1, 0, 0, 0)));
        transactionRepository.save(new Transaction(asset3, TransactionType.ADD, 30000L, "부동산 가치 상승", LocalDateTime.of(2025, 7, 9, 0, 0, 0)));

        //유저1
        Asset asset4 = assetRepository.findById(9).get();
        transactionRepository.save(new Transaction(asset4, TransactionType.ADD, 24000L, "2입금", LocalDateTime.of(2025, 7, 1, 0, 0, 0)));

        //유저1
        Asset asset5 = assetRepository.findById(12).get();
        transactionRepository.save(new Transaction(asset5, TransactionType.ADD, 71000L, "3입금", LocalDateTime.of(2025, 7, 1, 0, 0, 0)));
    }

    @Transactional
    @Profile("!test")
    public void accountTransactionInit() {
        if(accountTransactionRepository.count() > 0)
            return;

        Account account1 = accountRepository.findById(1).get();
        accountTransactionRepository.save(new AccountTransaction(account1, TransactionType.ADD, 17000L, "입금", LocalDateTime.of(2025, 7, 2, 0, 0, 0)));
        accountTransactionRepository.save(new AccountTransaction(account1, TransactionType.ADD, 2000L, "입금", LocalDateTime.of(2025, 7, 8, 0, 0, 0)));
        accountTransactionRepository.save(new AccountTransaction(account1, TransactionType.REMOVE, 18000L, "출금", LocalDateTime.of(2025, 7, 12, 0, 0, 0)));
        accountTransactionRepository.save(new AccountTransaction(account1, TransactionType.REMOVE, 12000L, "출금", LocalDateTime.of(2025, 7, 13, 0, 0, 0)));
        accountTransactionRepository.save(new AccountTransaction(account1, TransactionType.ADD, 9000L, "입금", LocalDateTime.of(2025, 7, 22, 0, 0, 0)));

        //유저1
        Account account2 = accountRepository.findById(3).get();
        accountTransactionRepository.save(new AccountTransaction(account2, TransactionType.REMOVE, 21000L, "2출금", LocalDateTime.of(2025, 7, 1, 0, 0, 0)));

        //유저1
        Account account3 = accountRepository.findById(5).get();
        accountTransactionRepository.save(new AccountTransaction(account3, TransactionType.REMOVE, 30000L, "3출금", LocalDateTime.of(2025, 7, 1, 0, 0, 0)));
    }

    @Transactional
    @Profile("!test")
    public void snapShotInit() {
        if(snapshotRepository.count() > 0)
            return;

        Member user1 = memberRepository.findById(4).orElseThrow();
        Member user2 = memberRepository.findById(5).orElseThrow();
        Member user3 = memberRepository.findById(6).orElseThrow();

        YearMonth now = YearMonth.now();

        // user1: 100만 시작, 매달 +20만 증가
        for (int i = 0; i < 6; i++) {
            YearMonth target = now.minusMonths(i);
            Snapshot snapshot = Snapshot.builder()
                    .member(user1)
                    .year(target.getYear())
                    .month(target.getMonthValue())
                    .totalAsset(1000000L + (20000 * i))
                    .build();
            snapshotRepository.save(snapshot);
        }

        // user2: 200만 시작, 매달 -10만 감소
        for (int i = 0; i < 6; i++) {
            YearMonth target = now.minusMonths(i);
            Snapshot snapshot = Snapshot.builder()
                    .member(user2)
                    .year(target.getYear())
                    .month(target.getMonthValue())
                    .totalAsset(2000000L - (10000 * i))
                    .build();
            snapshotRepository.save(snapshot);
        }

        // user3: 150만 고정
        for (int i = 0; i < 6; i++) {
            YearMonth target = now.minusMonths(i);
            Snapshot snapshot = Snapshot.builder()
                    .member(user3)
                    .year(target.getYear())
                    .month(target.getMonthValue())
                    .totalAsset(1500000L)
                    .build();
            snapshotRepository.save(snapshot);
        }
    }

    @Transactional
    @Profile("!test")
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
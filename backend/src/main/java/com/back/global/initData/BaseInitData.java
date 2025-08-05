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
import com.back.domain.notices.entity.Notice;
import com.back.domain.notices.repository.NoticeRepository;
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
    private final NoticeRepository noticeRepository;

    @Autowired
    @Lazy
    private BaseInitData self;

    private Member[] user;

    @Bean
    ApplicationRunner baseInitDataApplicationRunner() {
        return args -> {
            self.initializeAllData();
        };
    }

    @Transactional
    @Profile("!test")
    public void initializeAllData() {
        try {
            // 1. 인증용 테스트 계정들 (최우선)
            createAuthTestMembers();
            
            // 2. 기존 테스트 데이터
            memberInit();
            
            // 3. 계정 데이터 (member에 의존)
            accountInit();
            
            // 4. 자산 데이터 (member에 의존)
            assetInit();
            
            // 5. 거래 내역 데이터 (asset에 의존)
            transactionInit();
            accountTransactionInit();
            
            // 6. 스냅샷 데이터 (member에 의존)
            snapShotInit();
            
            // 7. 목표 데이터 (member에 의존)
            goalInit();
            
            // 8. 공지사항 데이터 (member에 의존)
            noticeInit();
            
            System.out.println("모든 초기 데이터가 성공적으로 생성되었습니다.");
        } catch (Exception e) {
            System.err.println("초기 데이터 생성 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("초기 데이터 생성 실패", e);
        }
    }

    private void createAuthTestMembers() {
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

    private void memberInit() {
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

    private void accountInit() {
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

    private void assetInit() {
        if(assetRepository.count() > 0)
            return;

        //유저1
        assetRepository.save(new Asset(user[1], "KB 적금", AssetType.DEPOSIT, 140000L, true));
        assetRepository.save(new Asset(user[1], "KB 예금", AssetType.DEPOSIT, 70000L, true));
        assetRepository.save(new Asset(user[1], "S-Oil", AssetType.STOCK, 622000L, true));
        assetRepository.save(new Asset(user[1], "삼성전자", AssetType.STOCK, 704000L, true));
        assetRepository.save(new Asset(user[1], "SK하이닉스", AssetType.STOCK, 2620000L, true));
        assetRepository.save(new Asset(user[1], "압구정 현대 (int값 제한..)", AssetType.REAL_ESTATE, 115000000L, true));
        assetRepository.save(new Asset(user[1], "한남더힐 (int값 제한..)", AssetType.REAL_ESTATE, 100000000L, true));
        assetRepository.save(new Asset(user[1], "롯데 시그니엘 (int값 제한..)", AssetType.REAL_ESTATE, 70000000L, true));

        //유저2
        assetRepository.save(new Asset(user[2], "2-예금1", AssetType.DEPOSIT, 10000L, true));
        assetRepository.save(new Asset(user[2], "2-주식1", AssetType.STOCK, 20000L, true));
        assetRepository.save(new Asset(user[2], "2-부동산1", AssetType.REAL_ESTATE, 30000L, true));

        //유저3
        assetRepository.save(new Asset(user[3], "3-예금1", AssetType.DEPOSIT, 10000L, true));
        assetRepository.save(new Asset(user[3], "3-주식1", AssetType.STOCK, 20000L, true));
        assetRepository.save(new Asset(user[3], "3-부동산1", AssetType.REAL_ESTATE, 30000L, true));
    }

    private void transactionInit() {
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

    private void accountTransactionInit() {
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

    private void snapShotInit() {
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

    private void goalInit() {
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

    private void noticeInit() {
        // 공지사항 데이터 초기화
        if (noticeRepository.count() == 0) {
            // 관리자 계정 찾기
            Member admin = memberRepository.findByEmail("admin@test.com")
                    .orElse(memberRepository.findByEmail("admin@admin.com")
                            .orElse(null));

            if (admin != null) {
                // 기존 5개 공지사항
                Notice notice1 = Notice.builder()
                        .title("자산관리 서비스 오픈 안내")
                        .content("안녕하세요! 자산관리 서비스가 정식 오픈되었습니다.\n\n" +
                                "이제 여러분의 자산을 체계적으로 관리할 수 있습니다.\n" +
                                "주요 기능:\n" +
                                "- 자산 등록 및 관리\n" +
                                "- 거래 내역 기록\n" +
                                "- 목표 설정 및 추적\n" +
                                "- 월별 스냅샷 기능\n\n" +
                                "많은 관심과 이용 부탁드립니다!")
                        .views(156)
                        .member(admin)
                        .build();
                noticeRepository.save(notice1);

                Notice notice2 = Notice.builder()
                        .title("시스템 점검 안내")
                        .content("시스템 점검이 예정되어 있습니다.\n\n" +
                                "점검 시간: 2025년 1월 15일 오전 2시 ~ 4시\n" +
                                "점검 내용: 서버 업그레이드 및 성능 개선\n\n" +
                                "점검 시간 동안 서비스 이용이 제한될 수 있습니다.\n" +
                                "불편을 드려 죄송합니다.")
                        .views(89)
                        .member(admin)
                        .build();
                noticeRepository.save(notice2);

                Notice notice3 = Notice.builder()
                        .title("새로운 기능 업데이트")
                        .content("새로운 기능이 추가되었습니다!\n\n" +
                                "추가된 기능:\n" +
                                "1. 공지사항 시스템\n" +
                                "2. 실시간 알림 기능\n" +
                                "3. 데이터 백업 기능\n" +
                                "4. 모바일 최적화\n\n" +
                                "더 나은 서비스를 위해 계속 노력하겠습니다.")
                        .views(203)
                        .member(admin)
                        .build();
                noticeRepository.save(notice3);

                Notice notice4 = Notice.builder()
                        .title("개인정보 보호 정책 업데이트")
                        .content("개인정보 보호 정책이 업데이트되었습니다.\n\n" +
                                "주요 변경사항:\n" +
                                "- 데이터 암호화 강화\n" +
                                "- 개인정보 수집 동의 절차 개선\n" +
                                "- 데이터 보관 기간 명시\n\n" +
                                "자세한 내용은 개인정보처리방침을 참고해 주세요.")
                        .views(67)
                        .member(admin)
                        .build();
                noticeRepository.save(notice4);

                Notice notice5 = Notice.builder()
                        .title("고객센터 운영 시간 안내")
                        .content("고객센터 운영 시간을 안내드립니다.\n\n" +
                                "운영 시간:\n" +
                                "- 평일: 오전 9시 ~ 오후 6시\n" +
                                "- 토요일: 오전 9시 ~ 오후 1시\n" +
                                "- 일요일 및 공휴일: 휴무\n\n" +
                                "문의사항이 있으시면 언제든 연락주세요.")
                        .views(342)
                        .member(admin)
                        .build();
                noticeRepository.save(notice5);

                // 추가 10개 공지사항
                Notice notice6 = Notice.builder()
                        .title("계좌 등록 방법 안내")
                        .content("계좌를 등록하는 방법을 안내드립니다.\n\n" +
                                "등록 방법:\n" +
                                "1. 마이페이지 > 계좌 목록으로 이동\n" +
                                "2. '계좌 추가' 버튼 클릭\n" +
                                "3. 계좌 정보 입력 (은행명, 계좌번호, 잔액)\n" +
                                "4. 저장 버튼 클릭\n\n" +
                                "계좌 등록 후 거래 내역도 함께 관리할 수 있습니다.")
                        .views(134)
                        .member(admin)
                        .build();
                noticeRepository.save(notice6);

                Notice notice7 = Notice.builder()
                        .title("자산 추가 기능 업데이트")
                        .content("자산 추가 기능이 업데이트되었습니다.\n\n" +
                                "개선된 기능:\n" +
                                "1. 자동 완성 기능\n" +
                                "2. 실시간 검증\n" +
                                "3. 일괄 등록 기능\n" +
                                "4. 데이터 백업\n\n" +
                                "이제 더욱 직관적이고 편리하게 자산을 관리할 수 있습니다.")
                        .views(178)
                        .member(admin)
                        .build();
                noticeRepository.save(notice7);

                Notice notice8 = Notice.builder()
                        .title("목표 설정 가이드")
                        .content("자산 관리의 목표를 설정하는 방법을 안내드립니다.\n\n" +
                                "목표 설정 방법:\n" +
                                "1. 구체적이고 달성 가능한 목표 설정\n" +
                                "2. 기한과 목표 금액 설정\n" +
                                "3. 정기적인 목표 점검\n" +
                                "4. 목표 달성 시 축하 메시지\n\n" +
                                "더욱 효과적인 자산 관리를 해보세요.")
                        .views(95)
                        .member(admin)
                        .build();
                noticeRepository.save(notice8);

                Notice notice9 = Notice.builder()
                        .title("모바일 앱 출시 안내")
                        .content("자산관리 서비스 모바일 앱이 출시되었습니다!\n\n" +
                                "모바일 앱 특징:\n" +
                                "- 언제 어디서나 자산 확인\n" +
                                "- 푸시 알림 기능\n" +
                                "- 생체 인증 지원\n" +
                                "- 오프라인 모드\n\n" +
                                "앱스토어에서 다운로드하세요.")
                        .views(267)
                        .member(admin)
                        .build();
                noticeRepository.save(notice9);

                Notice notice10 = Notice.builder()
                        .title("데이터 백업 서비스 안내")
                        .content("데이터 백업 서비스가 시작되었습니다.\n\n" +
                                "백업 서비스 특징:\n" +
                                "- 자동 백업 (매일 오전 3시)\n" +
                                "- 클라우드 저장소 활용\n" +
                                "- 데이터 암호화\n" +
                                "- 복원 기능 제공\n\n" +
                                "안전한 데이터 보관을 약속드립니다.")
                        .views(112)
                        .member(admin)
                        .build();
                noticeRepository.save(notice10);

                Notice notice11 = Notice.builder()
                        .title("보안 강화 업데이트")
                        .content("보안이 강화되었습니다.\n\n" +
                                "보안 강화 내용:\n" +
                                "1. 2단계 인증 추가\n" +
                                "2. 로그인 시도 제한\n" +
                                "3. 의심스러운 활동 감지\n" +
                                "4. 자동 로그아웃 기능\n\n" +
                                "더욱 안전한 서비스 이용이 가능합니다.")
                        .views(189)
                        .member(admin)
                        .build();
                noticeRepository.save(notice11);

                Notice notice12 = Notice.builder()
                        .title("API 서비스 오픈")
                        .content("API 서비스가 오픈되었습니다.\n\n" +
                                "API 서비스 특징:\n" +
                                "- RESTful API 제공\n" +
                                "- JSON 형식 데이터\n" +
                                "- 인증 토큰 기반\n" +
                                "- 상세한 문서 제공\n\n" +
                                "개발자분들의 많은 관심 부탁드립니다.")
                        .views(76)
                        .member(admin)
                        .build();
                noticeRepository.save(notice12);

                Notice notice13 = Notice.builder()
                        .title("성능 최적화 완료")
                        .content("서비스 성능이 최적화되었습니다.\n\n" +
                                "최적화 내용:\n" +
                                "1. 페이지 로딩 속도 개선\n" +
                                "2. 데이터베이스 쿼리 최적화\n" +
                                "3. 캐싱 시스템 도입\n" +
                                "4. CDN 서비스 적용\n\n" +
                                "더욱 빠른 서비스 이용이 가능합니다.")
                        .views(145)
                        .member(admin)
                        .build();
                noticeRepository.save(notice13);

                Notice notice14 = Notice.builder()
                        .title("사용자 피드백 반영")
                        .content("사용자분들의 소중한 피드백을 반영했습니다.\n\n" +
                                "반영된 피드백:\n" +
                                "1. UI/UX 개선\n" +
                                "2. 기능 추가 요청\n" +
                                "3. 버그 수정\n" +
                                "4. 성능 개선\n\n" +
                                "앞으로도 많은 피드백 부탁드립니다.")
                        .views(98)
                        .member(admin)
                        .build();
                noticeRepository.save(notice14);

                Notice notice15 = Notice.builder()
                        .title("연말 감사 인사")
                        .content("2024년 한 해 동안 많은 관심과 사랑을 주셔서 감사합니다.\n\n" +
                                "2024년 주요 성과:\n" +
                                "- 서비스 오픈\n" +
                                "- 사용자 10,000명 달성\n" +
                                "- 기능 확장\n" +
                                "- 보안 강화\n\n" +
                                "2025년에도 더 나은 서비스로 보답하겠습니다.")
                        .views(234)
                        .member(admin)
                        .build();
                noticeRepository.save(notice15);
            }
        }
    }
}
package com.back.domain.auth.service;

import com.back.domain.auth.dto.FindAccountResponseDto;
import com.back.domain.auth.dto.ResetPasswordResponseDto;
import com.back.domain.auth.dto.TokenPairDto;
import com.back.domain.auth.entity.RefreshToken;
import com.back.domain.auth.exception.AuthenticationException;
import com.back.domain.auth.repository.RefreshTokenRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.global.security.jwt.JwtUtil;
import com.back.global.security.service.RateLimitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;



@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RateLimitService rateLimitService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final TokenService tokenService;

    public FindAccountResponseDto findAccount(String name, String phoneNumber, String ipAddress) {
        // Rate limit 체크
        if (!rateLimitService.isAllowed(ipAddress)) {
            rateLimitService.recordAttempt(ipAddress);
            throw new AuthenticationException("잦은 시도로 일시적으로 차단되었습니다. 30분 후 다시 시도해주세요.");
        }

        Member member = memberRepository.findByNameAndPhoneNumberAndNotDeleted(name, phoneNumber)
                .orElseThrow(() -> {
                    rateLimitService.recordAttempt(ipAddress); //실패시 시도 기록
                    return new AuthenticationException("일치하는 회원 정보를 찾을 수 없습니다.");
                });

        if (!member.isActive()) {
            rateLimitService.recordAttempt(ipAddress); // 실패시 시도 기록
            throw new AuthenticationException("비활성화된 계정입니다.");
        }

        return FindAccountResponseDto.from(member);
    }


    @Transactional
    public ResetPasswordResponseDto resetPassword(String email, String name, String phoneNumber, String ipAddress) {
        // Rate limit 체크
        if (!rateLimitService.isAllowed(ipAddress)) {
            rateLimitService.recordAttempt(ipAddress);
            throw new AuthenticationException("잦은 시도로 일시적으로 차단되었습니다. 30분 후 다시 시도해주세요.");
        }


        Member member = memberRepository.findByEmailAndNameAndPhoneNumberAndNotDeleted(email, name, phoneNumber)
                .orElseThrow(() -> {
                    rateLimitService.recordAttempt(ipAddress); // 실패시 시도 기록
                    return new AuthenticationException("일치하는 회원 정보를 찾을 수 없습니다.");
                });

        if (!member.isActive()) {
            rateLimitService.recordAttempt(ipAddress); // 실패시 시도 기록
            throw new AuthenticationException("비활성화된 계정입니다.");
        }

        // 임시 비밀번호 생성 (8자리)
        String temporaryPassword = generateTemporaryPassword();
        String encodedPassword = passwordEncoder.encode(temporaryPassword);

        // 비밀번호 변경
        member.changePassword(encodedPassword);

        // 실제 서비스에서는 임시 비밀번호를 이메일이나 SMS로 전송해야 함
        // 여기서는 로그로만 출력 (개발/테스트 용도)
        System.out.println("임시 비밀번호가 생성되었습니다: " + temporaryPassword);
        System.out.println("이메일(" + email + ")로 임시 비밀번호를 전송했습니다.");

        return ResetPasswordResponseDto.of(true);
    }

    // 임시 비밀번호 생성 메서드
    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }

        return password.toString();
    }

    public Member authenticateUser(String email, String password) {
        Member member = memberRepository.findByEmailAndNotDeleted(email)
                .orElseThrow(() -> new AuthenticationException("존재하지 않는 이메일입니다."));

        if (!member.isActive()) {
            throw new AuthenticationException("비활성화된 계정입니다.");
        }

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new AuthenticationException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    @Transactional
    public TokenPairDto createTokenPair(Member member) {
        // 기존 토큰 무효화
        tokenService.invalidateAllUserTokens(member);

        // 새 토큰 쌍 생성 및 저장
        return tokenService.generateAndSaveTokenPair(member);
    }

    // Refresh Token 으로 새 Access Token 생성
    @Transactional
    public TokenPairDto refreshAccessToken(String refreshToken) {
        // Refresh Token 검증
        if (!jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            throw new AuthenticationException("유효하지 않은 Refresh Token입니다.");
        }

        // DB에서 토큰 조회후 member 정보 추출
        RefreshToken storedToken = refreshTokenRepository.findValidToken(refreshToken, LocalDateTime.now())
                .orElseGet(() -> {
                    handleSuspiciousTokenActivity(refreshToken);
                    throw new AuthenticationException("토큰 탈취가 의심됩니다. 관리자에게 문의해주세요.");
                });

        Member member = storedToken.getMember();

        // 새 토큰 쌍 생성
        return tokenService.rotateTokenPair(refreshToken, member);
    }

    // 로그아웃 시 Refresh Token 비활성화
    @Transactional
    public void invalidateRefreshToken(String refreshToken) {
        tokenService.invalidateToken(refreshToken);
    }


    // 사용자 ID로 회원 조회
    public Member findMemberById(int userId) {
        return memberRepository.findByIdAndNotDeleted(userId)
                .orElseThrow(() -> new AuthenticationException("존재하지 않는 사용자입니다."));
    }

    private void handleSuspiciousTokenActivity(String suspiciousToken) {
        try {
            // 토큰에서 사용자 정보 추출
            String email = jwtUtil.getEmailFromToken(suspiciousToken);

            // 해당 사용자의 모든 활성 토큰 무효화
            Member member = memberRepository.findByEmailAndNotDeleted(email)
                    .orElse(null);

            if (member != null) {
                tokenService.invalidateAllUserTokens(member);
                log.warn("의심스러운 토큰 활동 감지: 사용자 {}의 모든 토큰이 무효화되었습니다.", email);
            }
        } catch (Exception e) {
            log.error("의심스러운 토큰 활동 처리 중 오류 발생: {}", e.getMessage());
        }
    }
}

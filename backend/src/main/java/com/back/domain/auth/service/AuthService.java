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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Date;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RateLimitService rateLimitService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

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
        // 기존 활성화된 토큰 비활성화
        refreshTokenRepository.deactivateAllTokensByMember(member);

        // 새로운 Refresh Token 생성
        String accessToken = jwtUtil.generateToken(member.getEmail(), member.getId());
        String refreshToken = jwtUtil.generateRefreshToken(member.getEmail(), member.getId());

        // RefreshToken DB에 저장
        LocalDateTime expiryDate = convertToLocalDateTime(jwtUtil.getExpirationDateFromToken(refreshToken));
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .token(refreshToken)
                .member(member)
                .expiryDate(expiryDate)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        return TokenPairDto.of(accessToken, refreshToken);
    }

    // Refresh Token 으로 새 Access Token 생성
    @Transactional
    public TokenPairDto refreshAccessToken(String refreshToken) {
        // Refresh Token 검증
        if (!jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            throw new AuthenticationException("유효하지 않은 Refresh Token입니다.");
        }

        // DB에서 토큰 조회
        RefreshToken storedToken = refreshTokenRepository.findValidToken(refreshToken, LocalDateTime.now())
                .orElseThrow(() -> new AuthenticationException("만료되거나 존재하지 않는 Refresh Token입니다."));

        Member member = storedToken.getMember();

        // 새 토큰 쌍 생성 (Refresh Token 회전)
        String newAccessToken = jwtUtil.generateToken(member.getEmail(), member.getId());
        String newRefreshToken = jwtUtil.generateRefreshToken(member.getEmail(), member.getId());

        // 기존 토큰 업데이트
        LocalDateTime newExpiryDate = convertToLocalDateTime(jwtUtil.getExpirationDateFromToken(newRefreshToken));
        storedToken.updateToken(newRefreshToken, newExpiryDate);

        return TokenPairDto.of(newAccessToken, newRefreshToken);
    }

    // 로그아웃 시 Refresh Token 비활성화
    @Transactional
    public void invalidateRefreshToken(String refreshToken) {
        refreshTokenRepository.deactivateToken(refreshToken);
    }

    //Date를 LocalDateTime으로 변환하는 메서드
    private LocalDateTime convertToLocalDateTime(Date date) {
        return date.toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDateTime();
    }

    // 사용자 ID로 회원 조회
    public Member findMemberById(int userId) {
        return memberRepository.findByIdAndNotDeleted(userId)
                .orElseThrow(() -> new AuthenticationException("존재하지 않는 사용자입니다."));
    }
}

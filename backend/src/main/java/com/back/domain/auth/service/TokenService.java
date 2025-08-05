package com.back.domain.auth.service;

import com.back.domain.auth.dto.TokenPairDto;
import com.back.domain.auth.entity.RefreshToken;
import com.back.domain.auth.repository.RefreshTokenRepository;
import com.back.domain.member.entity.Member;
import com.back.global.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenService {

    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    //새로운 토크 쌍 생성, RefreshToken DB에 저장
    @Transactional
    public TokenPairDto generateAndSaveTokenPair(Member member) {
        // 토큰 쌍 생성
        String accessToken = jwtUtil.generateToken(member.getEmail(), member.getId(), member.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(member.getEmail(), member.getId(), member.getRole().name());

        // RefreshToken DB에 저장
        saveRefreshTokenToDatabase(refreshToken, member);

        return TokenPairDto.of(accessToken, refreshToken);
    }

    // 기존 토큰 무효화, 새로운 토큰 쌍 생성
    @Transactional
    public TokenPairDto rotateTokenPair(String oldRefreshToken, Member member) {
        // 기존 토큰 즉시 무효화
        invalidateToken(oldRefreshToken);

        // 새 토큰 쌍 생성 및 저장
        return generateAndSaveTokenPair(member);
    }

    // 토큰 무효화
    @Transactional
    public void invalidateToken(String oldRefreshToken) {
        refreshTokenRepository.deactivateToken(oldRefreshToken);
    }

    // 사용자의 모든 토큰 무효화
    @Transactional
    public void invalidateAllUserTokens(Member member) {
        refreshTokenRepository.deactivateAllTokensByMember(member);
    }

    //RefreshToken을 DB에 저장
    private void saveRefreshTokenToDatabase(String refreshToken, Member member) {
        LocalDateTime expiryDate = convertToLocalDateTime(jwtUtil.getExpirationDateFromToken(refreshToken));
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .token(refreshToken)
                .member(member)
                .expiryDate(expiryDate)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);
    }

    // Date를 LocalDateTime으로 변환하는 메서드
    private LocalDateTime convertToLocalDateTime(Date date) {
        return date.toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDateTime();
    }
}

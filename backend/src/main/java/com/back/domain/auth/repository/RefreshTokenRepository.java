package com.back.domain.auth.repository;

import com.back.domain.auth.entity.RefreshToken;
import com.back.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {

    // 토큰으로 조회(활성화된것만)
    @Query("SELECT rt From RefreshToken rt WHERE rt.token = :token AND rt.isActive = true AND rt.expiryDate > :now")
    Optional<RefreshToken> findValidToken(String token, LocalDateTime now);

    //사용자별 활성화된 토큰 조회
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.member = :member AND rt.isActive = true")
    Optional<RefreshToken> findActiveTokenByMember(Member member);

    //사용자의 모든 토큰 비활성화
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isActive = false WHERE rt.member = :member")
    void deactivateAllTokensByMember(Member member);

    // 만료된 토큰 정리
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryDate < :now")
    void deleteExpired(LocalDateTime now);

    //특정 토큰 비활성화
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isActive = false WHERE rt.token = :token")
    void deactivateToken(String token);
}

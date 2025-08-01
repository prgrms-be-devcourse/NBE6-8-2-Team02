package com.back.domain.auth.controller;


import com.back.domain.auth.dto.*;
import com.back.domain.auth.exception.AuthenticationException;
import com.back.domain.auth.service.AuthService;
import com.back.domain.member.entity.Member;
import com.back.global.config.JwtProperties;
import com.back.global.security.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@Slf4j
@Tag(name = "Auth", description = "인증 관련 API")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;
    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인 후 JWT 토큰을 발급받음.")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {

        // 1. 사용자 인증
        Member member = authService.authenticateUser(loginRequest.email(), loginRequest.password());

        // 2. JWT 토큰 쌍 생성(Access Token과 Refresh Token)
        // Access Token은 이메일과 사용자 ID를 포함
        TokenPairDto tokenPair = authService.createTokenPair(member);

        // 3. 응답 DTO 생성
        LoginResponseDto response = LoginResponseDto.of(
                tokenPair.accessToken(),
                jwtProperties.getAccessTokenValidity() / 1000, // 초 단위로 변환
                member
        );

        return createTokenCookieResponse(tokenPair, response);
    }

    @PostMapping("/find-account")
    @Operation(summary = "계정 찾기", description = "이름과 전화번호로 이메일을 찾습니다.")
    public ResponseEntity<FindAccountResponseDto> findAccount(
            @Valid @RequestBody FindAccountRequestDto request,
            HttpServletRequest httpRequest) {
        String ipAddress = getClientIpAddress(httpRequest);
        FindAccountResponseDto response = authService.findAccount(request.name(), request.phoneNumber(), ipAddress);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "비밀번호 재설정", description = "이메일, 이름, 전화번호 확인 후 비밀번호를 재설정합니다.")
    public ResponseEntity<ResetPasswordResponseDto> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDto request,
            HttpServletRequest httpRequest) {
        String ipAddress = getClientIpAddress(httpRequest);
        ResetPasswordResponseDto response = authService.resetPassword(
                request.email(),
                request.name(),
                request.phoneNumber(),
                ipAddress
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "JWT 토큰을 무효화하고 쿠키를 삭제합니다.")
    public ResponseEntity<LogoutResponseDto> logout(HttpServletRequest request) {
        // IP 주소 추출 및 로깅
        String ipAddress = getClientIpAddress(request);
        log.info("로그아웃 요청 IP: {}", ipAddress);

        // 쿠키 삭제를 위한 빈 쿠키 생성
        ResponseCookie deleteCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false) // 로컬 개발 중이면 false, 배포 환경에선 true
                .path("/")
                .maxAge(0) // 즉시 만료
                .sameSite("Lax")
                .build();

        LogoutResponseDto response = LogoutResponseDto.of(true);

        return ResponseEntity.ok()
                .header("Set-Cookie", deleteCookie.toString())
                .body(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "토큰 갱신", description = "Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.")
    public ResponseEntity<LoginResponseDto> refreshToken(HttpServletRequest request) {
    // 쿠키에서 RefreshToken 추출
    String refreshToken = extractRefreshTokenFromCookie(request);

    if (refreshToken == null) {
        throw new AuthenticationException("Refresh Token이 존재하지 않습니다.");
    }

    // 새 토큰 쌍 발급
        TokenPairDto tokenPair = authService.refreshAccessToken(refreshToken);

    //사용자 정보 조회 (Refresh Token에서 추출)
        int userId = jwtUtil.getUserIdFromToken(refreshToken);
        Member member = authService.findMemberById(userId);

        //응답 생성
        LoginResponseDto response = LoginResponseDto.of(
                tokenPair.accessToken(),
                jwtProperties.getAccessTokenValidity() / 1000, // 초 단위로 변환
                member
        );

        return createTokenCookieResponse(tokenPair, response);

    }

    // Refresh Token을 쿠키에서 추출하는 메서드
    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }



    // 토큰 쌍을 쿠키에 설정하고 응답을 반환하는 메서드
    private ResponseEntity<LoginResponseDto> createTokenCookieResponse(TokenPairDto tokenPair, LoginResponseDto response) {
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", tokenPair.accessToken())
                .httpOnly(true)
                .secure(false) // 로컬 개발 중이면 false, 배포 환경에선 true + HTTPS
                .path("/")
                .maxAge(jwtProperties.getAccessTokenValidity() / 1000)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokenPair.refreshToken())
                .httpOnly(true)
                .secure(false) // 로컬 개발 중이면 false, 배포 환경에선 true + HTTPS
                .path("/")
                .maxAge(jwtProperties.getRefreshTokenValidity() / 1000)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", accessCookie.toString())
                .header("Set-Cookie", refreshCookie.toString())
                .body(response);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr(); // 기본적으로 요청의 원격 주소를 반환
    }
}

package com.back.domain.auth.controller;


import com.back.domain.auth.dto.*;
import com.back.domain.auth.service.AuthService;
import com.back.domain.member.entity.Member;
import com.back.global.config.JwtProperties;
import com.back.global.security.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
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

        // 2. JWT 토큰 생성
        String accessToken = jwtUtil.generateToken(member.getEmail(), member.getId());

        // 3. 응답 DTO 생성
        LoginResponseDto response = LoginResponseDto.of(
                accessToken,
                jwtProperties.getAccessTokenValidity() / 1000, // 초 단위로 변환
                member
        );

        ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(false) // 로컬 개발 중이면 false, 배포 환경에선 true + HTTPS
                .path("/")
                .maxAge(jwtProperties.getAccessTokenValidity() / 1000)
                .sameSite("Lax") //
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    @PostMapping("/find-account")
    @Operation(summary = "계정 찾기", description = "이름과 전화번호로 이메일을 찾습니다.")
    public ResponseEntity<FindAccountResponseDto> findAccount(@Valid @RequestBody FindAccountRequestDto request) {
        FindAccountResponseDto response = authService.findAccount(request.name(), request.phoneNumber());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "비밀번호 재설정", description = "이메일, 이름, 전화번호 확인 후 비밀번호를 재설정합니다.")
    public ResponseEntity<ResetPasswordResponseDto> resetPassword(@Valid @RequestBody ResetPasswordRequestDto request) {
        ResetPasswordResponseDto response = authService.resetPassword(
                request.email(),
                request.name(),
                request.phoneNumber()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "JWT 토큰을 무효화하고 쿠키를 삭제합니다.")
    public ResponseEntity<LogoutResponseDto> logout(HttpServletRequest request) {
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

}

package com.back.domain.auth.controller;


import com.back.domain.auth.dto.ErrorResponseDto;
import com.back.domain.auth.dto.LoginRequestDto;
import com.back.domain.auth.dto.LoginResponseDto;
import com.back.domain.auth.exception.AuthenticationException;
import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.global.config.JwtProperties;
import com.back.global.security.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "인증 관련 API")
public class AuthController {

    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인 후 JWT 토큰을 발급받음.")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {

        // 1. 이메일로 회원 조회
        Member member = memberRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new AuthenticationException("존재하지 않는 이메일입니다."));
        // 2. 비활성화된 계정 체크
        if (!member.isActive()) {
            throw new AuthenticationException("비활성화된 계정입니다.");
        }

        // 3. 비밀번호 확인
        if (!passwordEncoder.matches(loginRequest.password(), member.getPassword())) {
            throw new AuthenticationException("비밀번호가 일치하지 않습니다.");
        }

        // 4. JWT 토큰 생성
        String accessToken = jwtUtil.generateToken(member.getEmail(), member.getId());

        // 5. 응답 DTO 생성
        LoginResponseDto response = LoginResponseDto.of(
                accessToken,
                jwtProperties.getAccessTokenValidity() / 1000, // 초 단위로 변환
                member
        );

        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponseDto> handleAuthenticationException(AuthenticationException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponseDto.of("INVALID_CREDENTIALS", e.getMessage()));
    }
}

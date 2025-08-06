package com.back.global.security.jwt;

import com.back.global.security.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.debug("JWT 필터 처리 시작 - URI: {}", requestURI);
        
        try {
            // Authorization 헤더에서 JWT 토큰 추출
            String token = getTokenFromRequest(request);
            log.debug("추출된 토큰 존재 여부: {}", StringUtils.hasText(token));

            // 토큰이 존재하고 유효한 경우
            if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
                log.debug("JWT 토큰 검증 성공");

                //토큰에서 이메일 추출
                String email = jwtUtil.getEmailFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);
                log.debug("토큰에서 추출한 사용자 정보 - 이메일: {}, 역할: {}", email, role);

                // 사용자 정보 로드
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                //JWT에서 추출한 role로 권한 생성
                Collection<SimpleGrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority("ROLE_" + role)
                );

                // Spring Security 인증 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("SecurityContext에 인증 정보 설정 완료");
            } else if (StringUtils.hasText(token)) {
                log.debug("JWT 토큰 검증 실패 - 유효하지 않은 토큰");
            }
        } catch (Exception e) {
            log.error("JWT 필터에서 예외 발생 - URI: {}, 오류: {}", requestURI, e.getMessage(), e);
            // 예외가 발생해도 필터 체인은 계속 진행 (permitAll 경로는 통과되어야 함)
        }

        // 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }

    // Authorization 헤더에서 Bearer 토큰 추출
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
            return bearerToken.substring(7); // "Bearer " 제거
        }

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}

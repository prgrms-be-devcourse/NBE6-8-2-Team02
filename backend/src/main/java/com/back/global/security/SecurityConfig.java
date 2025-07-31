package com.back.global.security;

import com.back.global.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // JWT 사용으로 세션 비활성화
                .authorizeHttpRequests(auth -> auth
                        //PUBLIC - 인증 불필요
                        .requestMatchers(
                                "/",
                                "/favicon.ico",
                                "/h2-console/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/api/v1/auth/**",           // 인증 관련 API 허용
                                "/api/v1/members/signup",    // 회원가입 API 허용
                                "/api/v1/members/check-email" // 이메일 중복체크 허용
                        ).permitAll()

                        // ADMIN 전용 - 관리자만 접근 가능
                        .requestMatchers(HttpMethod.GET, "/api/v1/members").hasRole("ADMIN")           // 전체 회원 조회
                        .requestMatchers(HttpMethod.GET, "/api/v1/members/active").hasRole("ADMIN")    // 활성 회원 조회
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/members/{memberId}").hasRole("ADMIN")  // 회원 삭제
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/members/{memberId}/activate").hasRole("ADMIN")    // 회원 활성화
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/members/{memberId}/deactivate").hasRole("ADMIN")  // 회원 비활성화

                        // USER - 인증된 사용자 (본인 데이터만)
                        .requestMatchers("/api/v1/members/me").authenticated()                         // 본인 정보 조회
                        .requestMatchers("/api/v1/members/search/**").authenticated()                  // 이메일/이름으로 조회
                        .requestMatchers(HttpMethod.PUT, "/api/v1/members/{memberId}").authenticated() // 본인 정보 수정
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/members/{memberId}/password").authenticated() // 비밀번호 변경

                        // 자산관리 관련 API - 인증된 사용자만
                        .requestMatchers("/api/v1/assets/**").authenticated()        // 자산 관리
                        .requestMatchers("/api/v1/accounts/**").authenticated()      // 계좌 관리
                        .requestMatchers("/api/v1/transactions/**").authenticated()  // 거래내역 관리
                        .requestMatchers("/api/v1/goals/**").authenticated()         // 목표 관리
                        .requestMatchers("/api/v1/snapshots/**").authenticated()     // 스냅샷 관리

                        .anyRequest().denyAll() // 나머지는 모두 차단
                )
                .headers(headers -> headers
                        .defaultsDisabled()
                        .frameOptions(frame -> frame.sameOrigin())
                )
                // JWT 필터를 UsernamePasswordAuthenticationFilter 전에 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
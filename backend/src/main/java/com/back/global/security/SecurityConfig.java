package com.back.global.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())                   // CSRF 비활성화
                .authorizeHttpRequests(auth -> auth// 모든 요청 허용
                        .requestMatchers(
                                "/",
                                "/favicon.ico",
                                "/h2-console/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/members/login",
                                "/members/signup"
                        ).permitAll() //로그인안하면 3곳만.
                        .anyRequest().permitAll()

                )
                .headers(headers -> headers
                        .defaultsDisabled()  // 기본 헤더 설정 비활성화
                        .frameOptions(frame -> frame.sameOrigin())
                );
        return http.build();
    }
}

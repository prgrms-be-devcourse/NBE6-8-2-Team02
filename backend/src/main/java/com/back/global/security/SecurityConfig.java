package com.back.global.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/favicon.ico",
                                "/h2-console/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll() //로그인안하면 3곳만.
                        /*
                        아래의 설정은 이후 권한 설정에 따라 수정이 필요.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/**").permitAll() // POST 요청 허용
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll() // GET 요청 허용
                        .requestMatchers(HttpMethod.PUT, "/api/**").permitAll() // PUT 요청 허용
                        .requestMatchers(HttpMethod.DELETE, "/api/**").permitAll() // DELETE 요청 허용
                        .requestMatchers(HttpMethod.PATCH, "/api/**").permitAll() // PATCH 요청 허용
                        .anyRequest().permitAll()

                )
                .headers(headers -> headers
                        .defaultsDisabled() // 기본 헤더 설정 비활성화
                        .frameOptions(frame -> frame.sameOrigin()) //h2-console을 위한 iframe 설정.
                );
        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() { // 3000 포트 CORS 설정.
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));

        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

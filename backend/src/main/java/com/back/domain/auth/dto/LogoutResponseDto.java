package com.back.domain.auth.dto;

public record LogoutResponseDto(
        boolean success
) {
    public static LogoutResponseDto of(boolean success) {
        return new LogoutResponseDto(success);
    }
}

package com.back.domain.auth.dto;

public record ResetPasswordResponseDto(
        boolean success
) {
    public static ResetPasswordResponseDto of(boolean success) {
        return new ResetPasswordResponseDto(success);
    }
}

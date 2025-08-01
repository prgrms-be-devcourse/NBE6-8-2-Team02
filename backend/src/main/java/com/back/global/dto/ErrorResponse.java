package com.back.global.dto;

import lombok.AllArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public class ErrorResponse {
    private int status;
    private String error; // HTTP 상태 이름
    private String message;
    private String path; //요청 경로
    private LocalDateTime timestamp;

    public ErrorResponse(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}

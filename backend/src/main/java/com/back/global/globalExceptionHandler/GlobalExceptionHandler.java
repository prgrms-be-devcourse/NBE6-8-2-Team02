package com.back.global.globalExceptionHandler;


import com.back.domain.account.exception.AccountAccessDeniedException;
import com.back.domain.account.exception.AccountDuplicateException;
import com.back.domain.auth.exception.AuthenticationException;

import com.back.domain.account.exception.AccountNotFoundException;
import com.back.global.dto.ErrorResponse;
import com.back.global.rsData.RsData;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import javax.security.auth.login.AccountException;
import java.util.NoSuchElementException;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
@Slf4j //Logger 선언
public class GlobalExceptionHandler {
    @Autowired
    private ObjectMapper objectMapper;
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<RsData<Void>> handleNoSuchElement(NoSuchElementException e) {
        return new ResponseEntity<>(
                new RsData<>(
                        "404-1",
                        e.getMessage()
                ),
                NOT_FOUND
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RsData<Void>> handleIllegalArgument(IllegalArgumentException e) {
        return new ResponseEntity<>(
                new RsData<>(
                        "400-1",
                        e.getMessage()
                ),
                NOT_FOUND
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<RsData<Void>> handleAuthentication(AuthenticationException e) {
        return new ResponseEntity<>(
                new RsData<>(
                        "401-1",
                        e.getMessage()
                ),
                UNAUTHORIZED
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
            public ResponseEntity<RsData<Void>> handleValidationException(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("입력값이 올바르지 않습니다.");

        return new ResponseEntity<>(
                new RsData<>(
                        "400-2",
                        errorMessage
                ),
                BAD_REQUEST
        );
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<RsData<Void>> handleIllegalState(IllegalStateException e) {
        return new ResponseEntity<>(
                new RsData<>(
                        "403-1",
                        e.getMessage()
                ),
                FORBIDDEN
        );
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<RsData<Void>> handleGeneralException(Exception e) {
        return new ResponseEntity<>(
                new RsData<>(
                        "500-1",
                        e.getMessage()
                ),
                INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAccountNotFoundException(AccountNotFoundException ex, WebRequest request) {
        HttpStatus status=HttpStatus.NOT_FOUND;

        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=",""));

        try {
            String json=objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(errorResponse);
            log.error("에러 발생: \n{}",json);
        }catch (JsonProcessingException e){
            log.error("JSON 변환 오류: {}", errorResponse);
        }
        return new ResponseEntity<>(errorResponse, NOT_FOUND);
    }

    @ExceptionHandler(AccountDuplicateException.class)
    public ResponseEntity<ErrorResponse> handleAccountDuplicateException(AccountDuplicateException ex, WebRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;

        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", ""));

        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(errorResponse);
            log.error("에러 발생: \n{}", json);
        } catch (JsonProcessingException e) {
            log.error("JSON 변환 오류: {}", errorResponse);
        }
        return new ResponseEntity<>(errorResponse, CONFLICT);
    }

    @ExceptionHandler(AccountAccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccountAccessDeniedException(AccountAccessDeniedException ex, WebRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", ""));

        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(errorResponse);
            log.error("에러 발생: \n{}", json);
        } catch (JsonProcessingException e) {
            log.error("JSON 변환 오류: {}", errorResponse);
        }
        return new ResponseEntity<>(errorResponse,FORBIDDEN);
    }
}
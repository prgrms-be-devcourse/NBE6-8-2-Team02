package com.back.global.globalExceptionHandler;

import com.back.domain.auth.exception.AuthenticationException;
import com.back.global.rsData.RsData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.NoSuchElementException;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
public class GlobalExceptionHandler {


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
}
package com.back.global.globalExceptionHandler;

import com.back.global.rsData.RsData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.NoSuchElementException;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ControllerAdvice
public class GlobalExceptionHandler {

    /*
    NoSuchElementException
    해당 id에 맞는 데이터가 조회되지 않을 경우.
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<RsData<Void>> handleNoSuchElement(NoSuchElementException e) {
        return new ResponseEntity<>(
                new RsData<>(
                        "400-1",
                        e.getMessage()
                ),
                NOT_FOUND
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
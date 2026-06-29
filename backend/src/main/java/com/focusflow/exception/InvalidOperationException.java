package com.focusflow.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested business operation violates system invariants or constraints.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message) {
        super(message);
    }
}

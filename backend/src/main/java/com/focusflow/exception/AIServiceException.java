package com.focusflow.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when the backend encounters an error communicating with the Google Gemini AI Service.
 */
@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class AIServiceException extends RuntimeException {
    public AIServiceException(String message) {
        super(message);
    }

    public AIServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

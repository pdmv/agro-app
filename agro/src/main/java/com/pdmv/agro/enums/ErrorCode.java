package com.pdmv.agro.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception.", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(8888, "Invalid message key.", HttpStatus.BAD_REQUEST),
    UPLOAD_FAILED(7777, "Cannot upload file now.", HttpStatus.BAD_REQUEST),
    DELETE_FAILED(7778, "Cannot delete file now.", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(1001, "Username existed.", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1002, "Username must be at least {min} characters.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1003, "Password must be at least {min} characters.", HttpStatus.BAD_REQUEST),
    USERNAME_NOT_EXISTED(1004, "Username not existed.", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1005, "Unauthenticated.", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1006, "Do not have permission.", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min} years old.", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    int code;
    String message;
    HttpStatusCode statusCode;
}

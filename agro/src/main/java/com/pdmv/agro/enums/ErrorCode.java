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
    INVALID_FIRSTNAME(1009, "Firstname must at least {min} characters.", HttpStatus.BAD_REQUEST),
    INVALID_LASTNAME(1010, "Lastname must at least {min} characters.", HttpStatus.BAD_REQUEST),
    INVALID_PHONE_NUMBER(1011, "Phone number must be 10 digits.", HttpStatus.BAD_REQUEST),
    INVALID_GENDER(1012, "Invalid gender value.", HttpStatus.BAD_REQUEST),
    INVALID_ROLE(1013, "Invalid role value.", HttpStatus.BAD_REQUEST),
    INVALID_PRODUCT_NAME(1014, "Product name must at least {min} characters.", HttpStatus.BAD_REQUEST),
    INVALID_SUPPLIER_NAME(1015, "Supplier name must at least {min} characters.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1016, "Invalid email.", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_MATCHED(1017, "Passwords do not match.", HttpStatus.BAD_REQUEST),
    ID_NOT_EXISTED(1018, "User ID not existed.", HttpStatus.NOT_FOUND),
    ROLE_IS_NULL(1019, "Role can not be null.", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1020, "Email existed.", HttpStatus.BAD_REQUEST),
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

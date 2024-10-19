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
    INVALID_STATUS(6666, "Status value is invalid.", HttpStatus.BAD_REQUEST),
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
    PRODUCT_NAME_EXISTED(1021, "Product name is existed.", HttpStatus.BAD_REQUEST),
    PRODUCT_NAME_IS_NULL(1022, "Product name can not null.", HttpStatus.BAD_REQUEST),
    PRODUCT_ID_NOT_EXISTED(1023, "Product ID not existed.", HttpStatus.BAD_REQUEST),
    SUPPLIER_NAME_EXISTED(1024, "Supplier name is existed.", HttpStatus.BAD_REQUEST),
    SUPPLIER_NAME_IS_NULL(1025, "Supplier name can not null.", HttpStatus.BAD_REQUEST),
    SUPPLIER_ID_NOT_EXISTED(1026, "Supplier ID not existed.", HttpStatus.BAD_REQUEST),
    STAFF_ID_NOT_EXISTED(1027, "Staff ID not existed.", HttpStatus.BAD_REQUEST),
    QUANTITY_IS_REQUIRED(1028, "Quantity is required.", HttpStatus.BAD_REQUEST),
    PURCHASE_ORDER_ID_NOT_EXISTED(1029, "Purchase order ID not existed.", HttpStatus.BAD_REQUEST),
    PURCHASE_ORDER_STATUS_NOT_PENDING(1030, "Purchase order status is not pending.", HttpStatus.BAD_REQUEST),
    STAFF_ROLE_NOT_ALLOWED(1031, "Staff role is not allowed.", HttpStatus.BAD_REQUEST),
    QUANTITY_NOT_ENOUGH_IN_INVENTORY(1032, "Quantity not enough in inventory.", HttpStatus.BAD_REQUEST),
    PURCHASE_ORDER_DETAIL_ID_INVALID(1033, "Purchase order detail ID is invalid.", HttpStatus.BAD_REQUEST),
    INVALID_PAYMENT_METHOD(1034, "Invalid payment method.", HttpStatus.BAD_REQUEST),
    INVALID_PAYMENT_STATUS(1035, "Invalid payment status.", HttpStatus.BAD_REQUEST),
    PURCHASE_ORDER_STATUS_INVALID(1036, "Purchase order status is invalid.", HttpStatus.BAD_REQUEST),
    PAYMENT_ID_NOT_EXISTED(1037, "Payment ID not existed.", HttpStatus.BAD_REQUEST),
    PAYMENT_CANNOT_BE_UPDATED(1038, "Payment cannot be updated.", HttpStatus.BAD_REQUEST),
    SUPPLIER_MISMATCH(1039, "Supplier mismatch.", HttpStatus.BAD_REQUEST),
    PRICE_EXISTED(1040, "Price existed.", HttpStatus.BAD_REQUEST),
    PRICE_ID_NOT_EXISTED(1041, "Price ID not existed.", HttpStatus.BAD_REQUEST),
    INVALID_ORDER_STATUS(1042, "Invalid order status.", HttpStatus.BAD_REQUEST),
    ORDER_ID_NOT_EXISTED(1043, "Order ID not existed.", HttpStatus.BAD_REQUEST),
    ORDER_STATUS_NOT_PENDING(1044, "Order status is not pending.", HttpStatus.BAD_REQUEST),
    INVENTORY_NOT_FOUND(1045, "Inventory not found.", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_STOCK(1046, "Insufficient stock.", HttpStatus.BAD_REQUEST),
    ORDER_STATUS_NOT_CONFIRMED(1047, "Order status is not confirmed.", HttpStatus.BAD_REQUEST),
    ORDER_STATUS_NOT_SHIPPING(1048, "Order status is not shipping.", HttpStatus.BAD_REQUEST),
    ORDER_STATUS_NOT_DELIVERED(1049, "Order status is not delivered.", HttpStatus.BAD_REQUEST),
    ORDER_DETAILS_EMPTY(1050, "Order details is empty.", HttpStatus.BAD_REQUEST),
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

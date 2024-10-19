package com.pdmv.agro.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderStatus {
    PENDING, CONFIRMED, SHIPPING, DELIVERED, PAID, CANCELLED
}

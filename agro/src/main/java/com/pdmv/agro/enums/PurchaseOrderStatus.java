package com.pdmv.agro.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PurchaseOrderStatus {
    PENDING, IMPORTED, PRICE_ENTERED, IN_PAYMENT, CANCELLED
}

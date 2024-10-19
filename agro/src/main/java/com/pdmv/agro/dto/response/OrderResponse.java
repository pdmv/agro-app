package com.pdmv.agro.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Integer id;
    CustomerResponse customer;
    PurchaseOrderStaff staff;
    BigDecimal totalAmount;
    BigDecimal discountAmount;
    BigDecimal netAmount;
    String shippingAddress;
    String shippingPhone;
    String paymentMethod;
    String status;
    String note;
    List<OrderDetailResponse> details;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean active;
}

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
public class PurchaseOrderListResponse {
    Integer id;
    SupplierResponse supplier;
    PurchaseOrderStaff staff;
    BigDecimal totalAmount;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean active;
}

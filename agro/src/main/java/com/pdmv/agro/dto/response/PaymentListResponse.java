package com.pdmv.agro.dto.response;

import com.pdmv.agro.pojo.Supplier;
import com.pdmv.agro.pojo.UserInfo;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentListResponse {
    Integer id;
    SupplierResponse supplier;
    PurchaseOrderStaff staff;
    BigDecimal totalAmount;
    String paymentMethod;
    String status;
    String note;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean active;
}

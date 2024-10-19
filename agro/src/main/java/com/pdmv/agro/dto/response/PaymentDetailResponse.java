package com.pdmv.agro.dto.response;

import com.pdmv.agro.pojo.Payment;
import com.pdmv.agro.pojo.PurchaseOrder;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentDetailResponse {
    Integer id;
    PurchaseOrderListResponse purchaseOrder;
    BigDecimal amount;
}

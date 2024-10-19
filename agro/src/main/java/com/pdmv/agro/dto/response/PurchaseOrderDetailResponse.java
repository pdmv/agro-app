package com.pdmv.agro.dto.response;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PurchaseOrderDetailResponse {
    Integer id;
    ProductResponse product;
    BigDecimal quantity;
    BigDecimal expectedPrice;
    BigDecimal unitPrice;
    BigDecimal totalPrice;
}

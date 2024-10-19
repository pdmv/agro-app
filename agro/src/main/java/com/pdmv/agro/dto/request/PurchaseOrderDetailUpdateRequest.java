package com.pdmv.agro.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PurchaseOrderDetailUpdateRequest {
    Integer productId;
    @NotNull(message = "QUANTITY_IS_REQUIRED")
    BigDecimal quantity;;
    BigDecimal expectedPrice;
    BigDecimal unitPrice;
}

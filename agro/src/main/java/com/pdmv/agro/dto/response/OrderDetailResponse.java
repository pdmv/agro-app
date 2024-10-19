package com.pdmv.agro.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailResponse {
    Integer id;
    PriceListResponse price;
    BigDecimal quantity;
    BigDecimal unitPrice;
    BigDecimal totalPrice;
}

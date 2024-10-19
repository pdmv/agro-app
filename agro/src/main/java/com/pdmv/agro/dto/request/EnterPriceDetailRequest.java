package com.pdmv.agro.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnterPriceDetailRequest {
    Integer id; // Purchase Order Detail Id
    BigDecimal unitPrice;
}

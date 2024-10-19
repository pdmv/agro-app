package com.pdmv.agro.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnterPricePurchaseOrderRequest {
    List<EnterPriceDetailRequest> details;
}

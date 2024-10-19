package com.pdmv.agro.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PriceResponse {
    Integer id;
    ProductResponse product;
    String itemName;
    BigDecimal price;
    LocalDate effectiveDate;
    List<ProductImageResponse> productImages;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean active;
}

package com.pdmv.agro.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PriceUpdateRequest {
    Integer productId;
    String itemName;
    BigDecimal price;
    LocalDate effectiveDate;
    MultipartFile primaryImage;
    MultipartFile[] secondaryImages;
}

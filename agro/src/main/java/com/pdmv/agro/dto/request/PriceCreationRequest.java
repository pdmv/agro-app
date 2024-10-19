package com.pdmv.agro.dto.request;

import jakarta.validation.constraints.NotNull;
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
public class PriceCreationRequest {
    @NotNull
    Integer productId;
    String itemName;
    @NotNull
    BigDecimal price;
    LocalDate effectiveDate;
    @NotNull
    MultipartFile primaryImage;
    MultipartFile[] secondaryImages;
}

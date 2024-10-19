package com.pdmv.agro.dto.request;

import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PurchaseOrderCreationRequest {
    Integer supplierId;
    Integer staffId;
    @Valid
    List<PurchaseOrderDetailRequest> details;
}

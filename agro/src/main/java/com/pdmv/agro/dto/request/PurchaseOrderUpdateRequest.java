package com.pdmv.agro.dto.request;

import com.pdmv.agro.enums.PurchaseOrderStatus;
import com.pdmv.agro.validator.EnumConstraint;
import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PurchaseOrderUpdateRequest {
    Integer supplierId;
    Integer staffId;
    @EnumConstraint(enumClass = PurchaseOrderStatus.class, message = "INVALID_STATUS")
    String status;
    @Valid
    List<PurchaseOrderDetailRequest> details;
}

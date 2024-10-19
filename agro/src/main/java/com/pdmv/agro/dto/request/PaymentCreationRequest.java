package com.pdmv.agro.dto.request;

import com.pdmv.agro.enums.PaymentMethod;
import com.pdmv.agro.enums.PaymentStatus;
import com.pdmv.agro.validator.EnumConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCreationRequest {
    Integer supplierId;
    Integer staffId;
    @EnumConstraint(enumClass = PaymentStatus.class, message = "INVALID_PAYMENT_STATUS")
    String status;
    @EnumConstraint(enumClass = PaymentMethod.class, message = "INVALID_PAYMENT_METHOD")
    String paymentMethod;
    String note;
    List<Integer> purchaseOrderIds;
}

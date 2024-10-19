package com.pdmv.agro.dto.request;

import com.pdmv.agro.enums.OrderStatus;
import com.pdmv.agro.enums.PaymentMethod;
import com.pdmv.agro.validator.EnumConstraint;
import com.pdmv.agro.validator.PhoneNumberConstraint;
import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCreationRequest {
    Integer customerId;
    BigDecimal discountAmount;
    String shippingAddress;
    @PhoneNumberConstraint
    String shippingPhone;
    @EnumConstraint(enumClass = PaymentMethod.class, message = "INVALID_PAYMENT_METHOD")
    String paymentMethod;
    @EnumConstraint(enumClass = OrderStatus.class, message = "INVALID_ORDER_STATUS")
    String status;
    String note;
    @Valid
    List<OrderDetailCreationRequest> details;
}

package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.PaymentListResponse;
import com.pdmv.agro.dto.response.PaymentResponse;
import com.pdmv.agro.pojo.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "details", ignore = true)
    PaymentResponse toPaymentResponse(Payment entity);
    List<PaymentListResponse> toListPaymentResponse(List<Payment> payments);
}

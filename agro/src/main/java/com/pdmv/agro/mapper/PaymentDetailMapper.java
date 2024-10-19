package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.PaymentDetailResponse;
import com.pdmv.agro.pojo.PaymentDetail;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentDetailMapper {
    PaymentDetailResponse toPaymentDetailResponse(PaymentDetail entity);
    List<PaymentDetailResponse> toListPaymentDetailResponse(List<PaymentDetail> entities);
}

package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.OrderDetailResponse;
import com.pdmv.agro.pojo.OrderDetail;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    OrderDetailResponse toOrderDetailResponse(OrderDetail entity);
    List<OrderDetailResponse> toListOrderDetailResponse(List<OrderDetail> entities);
}

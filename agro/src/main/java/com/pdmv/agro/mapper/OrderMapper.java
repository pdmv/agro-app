package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.OrderListResponse;
import com.pdmv.agro.dto.response.OrderResponse;
import com.pdmv.agro.pojo.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "details", ignore = true)
    OrderResponse toOrderResponse(Order entity);
    OrderListResponse toOrderListResponse(Order entity);
    List<OrderListResponse> toListOrderListResponse(List<Order> entities);
}

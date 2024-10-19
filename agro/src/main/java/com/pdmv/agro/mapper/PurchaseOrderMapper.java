package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.PurchaseOrderListResponse;
import com.pdmv.agro.dto.response.PurchaseOrderResponse;
import com.pdmv.agro.pojo.PurchaseOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PurchaseOrderMapper {
    @Mapping(target = "details", ignore = true)
    PurchaseOrderResponse toPurchaseOrderResponse(PurchaseOrder purchaseOrder);
    List<PurchaseOrderListResponse> toListPurchaseOrderListResponse(List<PurchaseOrder> purchaseOrders);


}

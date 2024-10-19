package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.PurchaseOrderDetailResponse;
import com.pdmv.agro.pojo.PurchaseOrderDetail;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PurchaseOrderDetailMapper {
    PurchaseOrderDetailResponse toPurchaseOrderDetailResponse(PurchaseOrderDetail entity);
    List<PurchaseOrderDetailResponse> toListPurchaseOrderDetailResponse(List<PurchaseOrderDetail> entities);
}

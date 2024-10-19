package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.PriceListResponse;
import com.pdmv.agro.dto.response.PriceResponse;
import com.pdmv.agro.pojo.Price;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PriceMapper {
    @Mapping(target = "productImages", ignore = true)
    PriceResponse toPriceResponse(Price price);
    @Mapping(target = "productPrimaryImage", ignore = true)
    PriceListResponse toPriceListResponse(Price price);
}

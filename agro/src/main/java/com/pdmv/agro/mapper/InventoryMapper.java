package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.InventoryResponse;
import com.pdmv.agro.pojo.Inventory;
import org.mapstruct.Mapper;
import org.springframework.data.jpa.repository.EntityGraph;

@Mapper(componentModel = "spring")
public interface InventoryMapper {
    @EntityGraph(attributePaths = {"product"})
    InventoryResponse toInventoryResponse(Inventory entity);
}

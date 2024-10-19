package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.request.SupplierRequest;
import com.pdmv.agro.dto.response.SupplierResponse;
import com.pdmv.agro.pojo.Supplier;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    Supplier toEntity(SupplierRequest dto);
    SupplierResponse toDto(Supplier entity);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(SupplierRequest dto, @MappingTarget Supplier supplier);
    List<SupplierResponse> toList(List<Supplier> suppliers);
}

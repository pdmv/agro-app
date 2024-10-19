package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.request.ProductRequest;
import com.pdmv.agro.dto.response.ProductResponse;
import com.pdmv.agro.pojo.Product;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toEntity(ProductRequest dto);
    ProductResponse toDto(Product entity);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(ProductRequest dto, @MappingTarget Product entity);
    List<ProductResponse> toList(List<Product> products);
}

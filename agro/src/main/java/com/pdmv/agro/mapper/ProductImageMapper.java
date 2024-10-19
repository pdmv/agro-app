package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.response.ProductImageResponse;
import com.pdmv.agro.pojo.ProductImage;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {
    ProductImageResponse toProductImageResponse(ProductImage entity);
    List<ProductImageResponse> toListProductImageResponse(List<ProductImage> entities);


}

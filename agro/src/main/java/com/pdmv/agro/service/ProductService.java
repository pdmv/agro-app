package com.pdmv.agro.service;

import com.pdmv.agro.dto.request.ProductRequest;
import com.pdmv.agro.dto.response.ProductResponse;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.mapper.ProductMapper;
import com.pdmv.agro.pojo.Product;
import com.pdmv.agro.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public ProductResponse create(ProductRequest request) {
        if (Objects.isNull(request.getName())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_IS_NULL);
        }

        if (isExistedName(request.getName())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTED);
        }

        Product product = productMapper.toEntity(request);
        productRepository.save(product);

        return productMapper.toDto(product);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public ProductResponse update(Integer productId, ProductRequest request) {
        Product product = productRepository.getProductsById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED));

        if (isExistedName(request.getName()) && !request.getName().equals(product.getName())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTED);
        }

        productMapper.partialUpdate(request, product);
        productRepository.save(product);

        return productMapper.toDto(product);
    }

    public List<ProductResponse> getProducts(String name, Pageable pageable) {
        List<Product> products = null;

        if (Objects.isNull(name) || name.isEmpty()) {
            products = productRepository.findAll(pageable).stream().toList();
        } else {
            products = productRepository.findByNameContainingIgnoreCase(name, pageable).stream().toList();
        }
        return productMapper.toList(products);
    }

    private boolean isExistedName(String name) {
        return productRepository.existsByName(name);
    }
}

package com.pdmv.agro.controller;


import com.pdmv.agro.dto.request.ProductRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.dto.response.ProductResponse;
import com.pdmv.agro.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    @PostMapping
    public ApiResponse<ProductResponse> create(@RequestBody @Valid ProductRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.create(request))
                .build();
    }

    @PostMapping("/change-product")
    public ApiResponse<ProductResponse> update(
            @RequestParam Integer productId, @RequestBody @Valid ProductRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.update(productId, request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(required = false) String name
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getProducts(name, pageable))
                .build();
    }
}

package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.SupplierRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.dto.response.ProductResponse;
import com.pdmv.agro.dto.response.SupplierResponse;
import com.pdmv.agro.service.SupplierService;
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
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierController {
    SupplierService supplierService;

    @PostMapping
    public ApiResponse<SupplierResponse> create(@RequestBody @Valid SupplierRequest request) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.create(request))
                .build();
    }

    @PostMapping("/change-supplier")
    public ApiResponse<SupplierResponse> update(
            @RequestParam Integer supplierId, @RequestBody @Valid SupplierRequest request) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.update(supplierId, request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<SupplierResponse>> getSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phoneNumber
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return ApiResponse.<List<SupplierResponse>>builder()
                .result(supplierService.getSuppliers(name, phoneNumber, pageable))
                .build();
    }
}

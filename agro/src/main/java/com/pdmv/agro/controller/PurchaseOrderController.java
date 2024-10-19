package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.EnterPricePurchaseOrderRequest;
import com.pdmv.agro.dto.request.PurchaseOrderCreationRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.dto.response.PurchaseOrderListResponse;
import com.pdmv.agro.dto.response.PurchaseOrderResponse;
import com.pdmv.agro.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/purchase-orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PurchaseOrderController {
    PurchaseOrderService purchaseOrderService;

    @PostMapping
    public ApiResponse<PurchaseOrderResponse> create(@RequestBody @Valid PurchaseOrderCreationRequest request) {
        return ApiResponse.<PurchaseOrderResponse>builder()
                .result(purchaseOrderService.create(request))
                .build();
    }

    @PostMapping("/update")
    public ApiResponse<PurchaseOrderResponse> update(
            @RequestParam("id") Integer id,
            @RequestBody @Valid PurchaseOrderCreationRequest request
    ) {
        return ApiResponse.<PurchaseOrderResponse>builder()
                .result(purchaseOrderService.update(id, request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PurchaseOrderListResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false) Map<String, Object> params
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return ApiResponse.<List<PurchaseOrderListResponse>>builder()
                .result(purchaseOrderService.findPurchaseOrders(params, pageable))
                .build();
    }

    @GetMapping("/detail")
    public ApiResponse<PurchaseOrderResponse> get(@RequestParam("id") Integer id) {
        return ApiResponse.<PurchaseOrderResponse>builder()
                .result(purchaseOrderService.getPurchaseOrder(id))
                .build();
    }

    @PostMapping("/enter-price")
    public ApiResponse<PurchaseOrderResponse> enterPrice(
            @RequestParam("id") Integer id,
            @RequestBody @Valid EnterPricePurchaseOrderRequest request
    ) {
        return ApiResponse.<PurchaseOrderResponse>builder()
                .result(purchaseOrderService.enterPrice(id, request))
                .build();
    }
}

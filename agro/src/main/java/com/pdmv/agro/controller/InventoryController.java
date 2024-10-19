package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.ImportInventoryRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.service.InventoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryController {
    InventoryService inventoryService;

    @PostMapping
    public ApiResponse importProduct(@RequestBody ImportInventoryRequest request) {
        inventoryService.importProduct(request.getPurchaseOrderId());
        return ApiResponse.builder()
                .message("Import products to inventory successful.")
                .build();
    }

    @GetMapping
    public ApiResponse list(@RequestParam(value = "productId", required = false) Integer productId) {
        if (productId != null) {
            return ApiResponse.builder()
                    .result(inventoryService.getInventoryByProductId(productId))
                    .build();
        }

        return ApiResponse.builder()
                .result(inventoryService.getInventories())
                .build();
    }
}

package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.PriceCreationRequest;
import com.pdmv.agro.dto.request.PriceUpdateRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.dto.response.PriceListResponse;
import com.pdmv.agro.dto.response.PriceResponse;
import com.pdmv.agro.service.PriceService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/prices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PriceController {
    PriceService priceService;

    @PostMapping(consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    public ApiResponse<PriceResponse> createPrice(@ModelAttribute @Valid PriceCreationRequest request) {
        return ApiResponse.<PriceResponse>builder()
                .result(priceService.create(request))
                .build();
    }

    @GetMapping("/detail")
    public ApiResponse<PriceResponse> getPrice(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "productId", required = false) Integer productId
    ) {
        if (id != null) {
            return ApiResponse.<PriceResponse>builder()
                    .result(priceService.getPrice(id))
                    .build();
        }
        return ApiResponse.<PriceResponse>builder()
                .result(priceService.getProductPrice(productId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PriceListResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false) Map<String, Object> params
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return ApiResponse.<List<PriceListResponse>>builder()
                .result(priceService.listPrices(params, pageable))
                .build();
    }

    @PostMapping(value = "/update", consumes = {
        MediaType.MULTIPART_FORM_DATA_VALUE
    })
    public ApiResponse<PriceResponse> updatePrice(
            @RequestParam("id") Integer id,
            @ModelAttribute @Valid PriceUpdateRequest request
    ) {
        return ApiResponse.<PriceResponse>builder()
                .result(priceService.update(id, request))
                .build();
    }
}

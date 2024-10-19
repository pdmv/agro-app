package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.OrderCreationRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.dto.response.OrderListResponse;
import com.pdmv.agro.dto.response.OrderResponse;
import com.pdmv.agro.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderController {
    OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> create(@RequestBody @Valid OrderCreationRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.create(request))
                .build();
    }

    @PostMapping("/confirm")
    public ApiResponse<OrderResponse> confirm(@RequestParam Integer orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.confirm(orderId))
                .build();
    }

    @PostMapping("/shipping")
    public ApiResponse<OrderResponse> shipping(@RequestParam Integer orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.shipping(orderId))
                .build();
    }

    @PostMapping("/delivered")
    public ApiResponse<OrderResponse> delivered(@RequestParam Integer orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.delivered(orderId))
                .build();
    }

    @PostMapping("/paid")
    public ApiResponse<OrderResponse> paid(@RequestParam Integer orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.paid(orderId))
                .build();
    }

    @GetMapping("/own")
    public ApiResponse<List<OrderListResponse>> getOwnOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));

        return ApiResponse.<List<OrderListResponse>>builder()
                .result(orderService.getOwnOrder(pageable))
                .build();
    }

    @GetMapping
    public ApiResponse<List<OrderListResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false) Map<String, Object> params
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));

        log.info("params: {}", params);

        return ApiResponse.<List<OrderListResponse>>builder()
                .result(orderService.findOrders(params, pageable))
                .build();
    }

    @PostMapping("/cancel")
    public ApiResponse<OrderResponse> cancel(@RequestParam Integer orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.cancel(orderId))
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable Integer orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.get(orderId))
                .build();
    }
}

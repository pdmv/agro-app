package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.PaymentCreationRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.dto.response.PaymentListResponse;
import com.pdmv.agro.dto.response.PaymentResponse;
import com.pdmv.agro.service.PaymentService;
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
@RequestMapping("/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;

    @PostMapping
    public ApiResponse<PaymentResponse> createPayment(@RequestBody @Valid PaymentCreationRequest request) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.createPayment(request))
                .build();
    }

    @PostMapping("/update")
    public ApiResponse<PaymentResponse> updatePayment(
            @RequestParam("id") Integer id,
            @RequestBody @Valid PaymentCreationRequest request
    ) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.updatePayment(id, request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PaymentListResponse>> listPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false) Map<String, Object> params
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return ApiResponse.<List<PaymentListResponse>>builder()
                .result(paymentService.findPayments(params, pageable))
                .build();
    }

    @GetMapping("/detail")
    public ApiResponse<PaymentResponse> getPayment(@RequestParam("id") Integer id) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.getPayment(id))
                .build();
    }

    @GetMapping("/paid")
    public ApiResponse<PaymentResponse> paidPayment(@RequestParam("id") Integer id) {
        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.paid(id))
                .build();
    }
}

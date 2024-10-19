package com.pdmv.agro.service;

import com.pdmv.agro.dto.request.PaymentCreationRequest;
import com.pdmv.agro.dto.response.PaymentListResponse;
import com.pdmv.agro.dto.response.PaymentResponse;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.enums.PaymentMethod;
import com.pdmv.agro.enums.PaymentStatus;
import com.pdmv.agro.enums.PurchaseOrderStatus;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.mapper.PaymentDetailMapper;
import com.pdmv.agro.mapper.PaymentMapper;
import com.pdmv.agro.pojo.*;
import com.pdmv.agro.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional
public class PaymentService {
    PaymentRepository paymentRepository;
    PaymentDetailRepository paymentDetailRepository;
    UserInfoRepository userInfoRepository;
    SupplierRepository supplierRepository;
    PurchaseOrderRepository purchaseOrderRepository;

    PaymentMapper paymentMapper;
    PaymentDetailMapper paymentDetailMapper;

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public PaymentResponse createPayment(PaymentCreationRequest request) {
        Payment payment = buildNewPayment(request);
        paymentRepository.save(payment);

        List<PaymentDetail> details = processPaymentDetails(payment, request.getPurchaseOrderIds());
        payment.setTotalAmount(calculateTotalAmount(details));
        paymentRepository.save(payment);
        paymentDetailRepository.saveAll(details);

        return buildPaymentResponse(payment, details);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public PaymentResponse updatePayment(Integer paymentId, PaymentCreationRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_ID_NOT_EXISTED));

        if (!payment.getStatus().equals(PaymentStatus.PENDING.name())) {
            throw new AppException(ErrorCode.PAYMENT_CANNOT_BE_UPDATED);
        }

        updateBasicPaymentInfo(payment, request);
        List<PaymentDetail> details = updatePaymentDetails(payment, request.getPurchaseOrderIds());
        payment.setTotalAmount(calculateTotalAmount(details));
        paymentRepository.save(payment);
        paymentDetailRepository.saveAll(details);

        return buildPaymentResponse(payment, details);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public List<PaymentListResponse> findPayments(Map<String, Object> params, Pageable pageable) {
        Optional<String> supplierName = Optional.ofNullable((String) params.get("supplierName"));
        Optional<String> staffName = Optional.ofNullable((String) params.get("staffName"));
        Optional<String> status = Optional.ofNullable((String) params.get("status"));
        Optional<LocalDateTime> startDate = parseDate(params.get("startDate"));
        Optional<LocalDateTime> endDate = parseDate(params.get("endDate"));
        Optional<Integer> id = parseInteger(params.get("id"));

        List<Payment> payments;

        // Kiểm tra nếu có status
        if (status.isPresent()) {
            payments = paymentRepository.findByStatusEquals(status.get(), pageable);
        }
        // Kiểm tra nếu có supplierName và phạm vi ngày
        else if (supplierName.isPresent()) {
            if (startDate.isPresent() && endDate.isPresent()) {
                payments = paymentRepository.findByCreatedAtBetweenAndSupplier_NameContainingIgnoreCase(
                        startDate.get(), endDate.get(), supplierName.get(), pageable);
            } else {
                payments = paymentRepository.findBySupplier_NameContainingIgnoreCase(supplierName.get(), pageable);
            }
        }
        // Kiểm tra nếu có staffName và phạm vi ngày
        else if (staffName.isPresent()) {
            if (startDate.isPresent() && endDate.isPresent()) {
                payments = paymentRepository.findByCreatedAtBetweenAndStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
                        startDate.get(), endDate.get(), staffName.get(), staffName.get(), pageable);
            } else {
                payments = paymentRepository.findByStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
                        staffName.get(), staffName.get(), pageable);
            }
        }
        // Kiểm tra nếu chỉ có phạm vi ngày
        else if (startDate.isPresent() && endDate.isPresent()) {
            payments = paymentRepository.findByCreatedAtBetween(startDate.get(), endDate.get(), pageable);
        }
        // Kiểm tra nếu có ID
        else if (id.isPresent()) {
            payments = paymentRepository.findWithDetailsById(id.get())
                    .map(Collections::singletonList)
                    .orElse(Collections.emptyList());
        }
        // Mặc định trả về tất cả payment với phân trang
        else {
            payments = paymentRepository.findAll(pageable).getContent();
        }

        return paymentMapper.toListPaymentResponse(payments);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public PaymentResponse getPayment(Integer id) {
        Payment payment = paymentRepository.findWithDetailsById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_ID_NOT_EXISTED));
        List<PaymentDetail> details = paymentDetailRepository.findByPaymentId(id);
        return buildPaymentResponse(payment, details);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public PaymentResponse paid(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_ID_NOT_EXISTED));

        if (!payment.getStatus().equals(PaymentStatus.PENDING.name())) {
            throw new AppException(ErrorCode.PAYMENT_CANNOT_BE_UPDATED);
        }

        payment.setStatus(PaymentStatus.PAID.name());
        paymentRepository.save(payment);

        List<PaymentDetail> details = paymentDetailRepository.findByPaymentId(id);

        return buildPaymentResponse(payment, details);
    }

    // Method to handle basic payment creation
    private Payment buildNewPayment(PaymentCreationRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_ID_NOT_EXISTED));

        UserInfo staff = getStaffInfo(request.getStaffId());
        return Payment.builder()
                .supplier(supplier)
                .staff(staff)
                .status(request.getStatus() == null ? PaymentStatus.PENDING.name() : request.getStatus())
                .paymentMethod(request.getPaymentMethod() == null ? PaymentMethod.CASH.name() : request.getPaymentMethod())
                .note(request.getNote())
                .build();
    }

    // Method to update basic payment info
    private void updateBasicPaymentInfo(Payment payment, PaymentCreationRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_ID_NOT_EXISTED));

        UserInfo staff = getStaffInfo(request.getStaffId());

        payment.setSupplier(supplier);
        payment.setStaff(staff);
        payment.setStatus(request.getStatus());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNote(request.getNote());
    }

    // Method to retrieve the staff info
    private UserInfo getStaffInfo(Integer staffId) {
        return Objects.isNull(staffId)
                ? userInfoRepository.getUserInfoByAccount_Username(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED))
                : userInfoRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_ID_NOT_EXISTED));
    }

    // Method to process payment details for new Payment
    private List<PaymentDetail> processPaymentDetails(Payment payment, List<Integer> purchaseOrderIds) {
        List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findAllById(purchaseOrderIds);
        List<PaymentDetail> details = new ArrayList<>();

        for (PurchaseOrder purchaseOrder : purchaseOrders) {
            if (!purchaseOrder.getSupplier().getId().equals(payment.getSupplier().getId())) {
                throw new AppException(ErrorCode.SUPPLIER_MISMATCH);
            }

            validatePurchaseOrderStatus(purchaseOrder, PurchaseOrderStatus.PRICE_ENTERED.name());
            purchaseOrder.setStatus(PurchaseOrderStatus.IN_PAYMENT.name());

            PaymentDetail detail = PaymentDetail.builder()
                    .payment(payment)
                    .purchaseOrder(purchaseOrder)
                    .amount(purchaseOrder.getTotalAmount())
                    .build();
            details.add(detail);
        }
        return details;
    }

    // Method to handle the update of PaymentDetails
    private List<PaymentDetail> updatePaymentDetails(Payment payment, List<Integer> newPurchaseOrderIds) {
        List<PurchaseOrder> newPurchaseOrders = purchaseOrderRepository.findAllById(newPurchaseOrderIds);
        List<PaymentDetail> existingDetails = paymentDetailRepository.findByPaymentId(payment.getId());
        List<PaymentDetail> updatedDetails = new ArrayList<>();

        for (PaymentDetail detail : existingDetails) {
            if (!newPurchaseOrders.contains(detail.getPurchaseOrder())) {
                removePaymentDetail(detail);
            } else {
                updatedDetails.add(detail);
                newPurchaseOrders.remove(detail.getPurchaseOrder());
            }
        }

        updatedDetails.addAll(processPaymentDetails(payment, extractIdsFromPurchaseOrders(newPurchaseOrders)));
        return updatedDetails;
    }

    // Method to validate the status of a PurchaseOrder
    private void validatePurchaseOrderStatus(PurchaseOrder purchaseOrder, String expectedStatus) {
        if (!purchaseOrder.getStatus().equals(expectedStatus)) {
            throw new AppException(ErrorCode.PURCHASE_ORDER_STATUS_INVALID);
        }
    }

    // Method to remove a PaymentDetail and reset the status of a PurchaseOrder
    private void removePaymentDetail(PaymentDetail detail) {
        paymentDetailRepository.delete(detail);
        PurchaseOrder purchaseOrder = detail.getPurchaseOrder();
        purchaseOrder.setStatus(PurchaseOrderStatus.PRICE_ENTERED.name());
        purchaseOrderRepository.save(purchaseOrder);
    }

    // Method to calculate total amount of Payment
    private BigDecimal calculateTotalAmount(List<PaymentDetail> details) {
        return details.stream()
                .map(PaymentDetail::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Method to extract IDs from a list of PurchaseOrders
    private List<Integer> extractIdsFromPurchaseOrders(List<PurchaseOrder> purchaseOrders) {
        List<Integer> ids = new ArrayList<>();
        for (PurchaseOrder order : purchaseOrders) {
            ids.add(order.getId());
        }
        return ids;
    }

    // Method to build a PaymentResponse
    private PaymentResponse buildPaymentResponse(Payment payment, List<PaymentDetail> details) {
        PaymentResponse response = paymentMapper.toPaymentResponse(payment);
        response.setDetails(paymentDetailMapper.toListPaymentDetailResponse(details));
        return response;
    }

    private Optional<LocalDateTime> parseDate(Object date) {
        // Chuyển đổi và xử lý dữ liệu ngày tháng ở đây
        return Optional.empty(); // Thay thế bằng logic chuyển đổi thực tế
    }

    private Optional<Integer> parseInteger(Object id) {
        // Chuyển đổi và xử lý dữ liệu số nguyên ở đây
        return Optional.empty(); // Thay thế bằng logic chuyển đổi thực tế
    }
}

package com.pdmv.agro.service;

import com.pdmv.agro.dto.request.EnterPriceDetailRequest;
import com.pdmv.agro.dto.request.EnterPricePurchaseOrderRequest;
import com.pdmv.agro.dto.request.PurchaseOrderCreationRequest;
import com.pdmv.agro.dto.request.PurchaseOrderDetailRequest;
import com.pdmv.agro.dto.response.PurchaseOrderDetailResponse;
import com.pdmv.agro.dto.response.PurchaseOrderListResponse;
import com.pdmv.agro.dto.response.PurchaseOrderResponse;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.enums.PurchaseOrderStatus;
import com.pdmv.agro.enums.Role;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.mapper.PurchaseOrderDetailMapper;
import com.pdmv.agro.mapper.PurchaseOrderMapper;
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
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional
public class PurchaseOrderService {
    PurchaseOrderRepository purchaseOrderRepository;
    PurchaseOrderDetailRepository purchaseOrderDetailRepository;
    SupplierRepository supplierRepository;
    UserInfoRepository userInfoRepository;
    ProductRepository productRepository;

    PurchaseOrderMapper purchaseOrderMapper;
    PurchaseOrderDetailMapper purchaseOrderDetailMapper;

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public PurchaseOrderResponse create(PurchaseOrderCreationRequest request) {
        log.info("Supplier ID: {}", request.getSupplierId());

        // Kiểm tra supplier
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_ID_NOT_EXISTED));

        // Kiểm tra staffId (không có lấy context holder)
        UserInfo staff = Objects.isNull(request.getStaffId())
                ? userInfoRepository.getUserInfoByAccount_Username(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED))
                : userInfoRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_ID_NOT_EXISTED));

        // Tạo đơn nhập hàng
        PurchaseOrder order = PurchaseOrder.builder()
                .supplier(supplier)
                .staff(staff)
                .totalAmount(BigDecimal.ZERO) // Sẽ có khi nhập giá
                .status(PurchaseOrderStatus.PENDING.name())
                .build();

        order = purchaseOrderRepository.save(order);

        // Lấy tất cả productId request
        List<Integer> productIds = request.getDetails().stream()
                .map(PurchaseOrderDetailRequest::getProductId)
                .toList();

        // Phải có ít nhất 1 product
        if (productIds.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED);
        }

        // Lấy tất cả product request
        List<Product> products = productRepository.findAllById(productIds);

        // Map Product ID và Product để dễ truy xuất
        Map<Integer, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        // Tạo PurchaseOrderDetails để chuẩn bị lưu
        List<PurchaseOrderDetail> detailsToSave = new ArrayList<>();

        // Tạo PurchaseOrderDetailResponse để trả về
        List<PurchaseOrderDetailResponse> detailsResponse = new ArrayList<>();

        for (PurchaseOrderDetailRequest detailRequest : request.getDetails()) {
            Product product = productMap.get(detailRequest.getProductId());

            if (product == null) {
                throw new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED);
            }

            // Tạo mới PurchaseOrderDetail
            PurchaseOrderDetail detail = PurchaseOrderDetail.builder()
                    .purchaseOrder(order)
                    .product(product)
                    .quantity(detailRequest.getQuantity())
                    .expectedPrice(Objects.isNull(detailRequest.getExpectedPrice())
                            ? BigDecimal.ZERO
                            : detailRequest.getExpectedPrice())
                    .unitPrice(BigDecimal.ZERO)  // Sẽ có khi nhập giá
                    .totalPrice(BigDecimal.ZERO) // Sẽ có khi nhập giá
                    .build();

            detailsToSave.add(detail);
        }

        // Lưu tất cả details một lần
        purchaseOrderDetailRepository.saveAll(detailsToSave);

        // Convert saved details sang response format
        detailsResponse = detailsToSave.stream()
                .map(purchaseOrderDetailMapper::toPurchaseOrderDetailResponse)
                .collect(Collectors.toList());

        // Map PurchaseOrder về response
        PurchaseOrderResponse response = purchaseOrderMapper.toPurchaseOrderResponse(order);
        response.setDetails(detailsResponse);

        return response;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public PurchaseOrderResponse update(Integer purchaseOrderId, PurchaseOrderCreationRequest request) {
        PurchaseOrder order = purchaseOrderRepository.findWithDetailsById(purchaseOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_ID_NOT_EXISTED));

        // Chỉ cho phép cập nhật khi đơn hàng ở trạng thái PENDING
        if (!order.getStatus().equals(PurchaseOrderStatus.PENDING.name())) {
            throw new AppException(ErrorCode.PURCHASE_ORDER_STATUS_NOT_PENDING);
        }

        // Validate Supplier and Staff (if provided)
        if (request.getSupplierId() != null && !request.getSupplierId().equals(order.getSupplier().getId())) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_ID_NOT_EXISTED));
            order.setSupplier(supplier);
        }

        if (request.getStaffId() != null && !request.getStaffId().equals(order.getStaff().getId())) {
            UserInfo staff = userInfoRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new AppException(ErrorCode.STAFF_ID_NOT_EXISTED));
            if (staff.getAccount().getRole().equals(Role.CUSTOMER.name())) {
                throw new AppException(ErrorCode.STAFF_ROLE_NOT_ALLOWED);
            }
            order.setStaff(staff);
        }

        // Lấy danh sách productId từ request
        List<Integer> productIds = request.getDetails().stream()
                .map(PurchaseOrderDetailRequest::getProductId)
                .toList();

        // Phải có ít nhất 1 product
        if (productIds.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED);
        }

        // Lấy tất cả các sản phẩm từ danh sách productId
        Map<Integer, Product> productMap = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        List<PurchaseOrderDetailResponse> updatedDetails = new ArrayList<>();

        // Xử lý PurchaseOrderDetails
        for (PurchaseOrderDetailRequest detailRequest : request.getDetails()) {
            Product product = productMap.get(detailRequest.getProductId());

            if (product == null) {
                throw new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED);
            }

            // Tìm existing detail (nếu có)
            PurchaseOrderDetail existingDetail = purchaseOrderDetailRepository
                    .findByPurchaseOrder_IdAndProduct_Id(order.getId(), product.getId()).orElseGet(() -> null);

            if (existingDetail != null) {
                // Update existing detail
                existingDetail.setQuantity(detailRequest.getQuantity());
                existingDetail.setExpectedPrice(detailRequest.getExpectedPrice());
                purchaseOrderDetailRepository.save(existingDetail);
                updatedDetails.add(purchaseOrderDetailMapper.toPurchaseOrderDetailResponse(existingDetail));
            } else {
                // Tạo detail mới
                PurchaseOrderDetail newDetail = PurchaseOrderDetail.builder()
                        .purchaseOrder(order)
                        .product(product)
                        .quantity(detailRequest.getQuantity())
                        .expectedPrice(detailRequest.getExpectedPrice())
                        .unitPrice(BigDecimal.valueOf(0))
                        .totalPrice(BigDecimal.valueOf(0))
                        .build();

                purchaseOrderDetailRepository.save(newDetail);
                updatedDetails.add(purchaseOrderDetailMapper.toPurchaseOrderDetailResponse(newDetail));
            }
        }

        // Xóa những chi tiết không có trong request
        List<PurchaseOrderDetail> detailsToRemove = purchaseOrderDetailRepository
                .findPurchaseOrderDetailsByPurchaseOrder_Id(order.getId());
        detailsToRemove.removeIf(detail -> productIds.contains(detail.getProduct().getId()));

        purchaseOrderDetailRepository.deleteAll(detailsToRemove);

        purchaseOrderRepository.save(order);

        PurchaseOrderResponse response = purchaseOrderMapper.toPurchaseOrderResponse(order);
        response.setDetails(updatedDetails);
        return response;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public List<PurchaseOrderListResponse> findPurchaseOrders(Map<String, Object> params, Pageable pageable) {
        Optional<String> supplierName = Optional.ofNullable((String) params.get("supplierName"));
        Optional<String> supplierId = Optional.ofNullable((String) params.get("supplierId"));
        Optional<String> staffName = Optional.ofNullable((String) params.get("staffName"));
        Optional<String> status = Optional.ofNullable((String) params.get("status"));
        Optional<LocalDateTime> startDate = parseDate(params.get("startDate"));
        Optional<LocalDateTime> endDate = parseDate(params.get("endDate"));
        Optional<Integer> id = parseInteger(params.get("id"));

        List<PurchaseOrder> purchaseOrders;

        if (supplierName.isPresent()) {
            if (startDate.isPresent() && endDate.isPresent()) {
                purchaseOrders = purchaseOrderRepository.findByCreatedAtBetweenAndSupplier_NameContainingIgnoreCase(
                        startDate.get(), endDate.get(), supplierName.get(), pageable);
            } else if (status.isPresent()) {
                purchaseOrders = purchaseOrderRepository.findByStatusEqualsAndSupplier_NameContainingIgnoreCase(
                        status.get(), supplierName.get(), pageable);
            } else {
                purchaseOrders = purchaseOrderRepository.findBySupplier_NameContainingIgnoreCase(supplierName.get(), pageable);
            }
        } else if (supplierId.isPresent()) {
            if (status.isPresent()) {
                purchaseOrders = purchaseOrderRepository.findBySupplier_IdAndStatusEquals(
                        Integer.parseInt(supplierId.get()), status.get(), pageable);
            } else {
                purchaseOrders = purchaseOrderRepository.findBySupplier_NameContainingIgnoreCase(supplierName.get(), pageable);
            }
        } else if (staffName.isPresent()) {
            if (startDate.isPresent() && endDate.isPresent()) {
                purchaseOrders = purchaseOrderRepository.findByCreatedAtBetweenAndStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
                        startDate.get(), endDate.get(), staffName.get(), staffName.get(), pageable);
            } else {
                purchaseOrders = purchaseOrderRepository.findByStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
                        staffName.get(), staffName.get(), pageable);
            }
        } else if (startDate.isPresent() && endDate.isPresent()) {
            purchaseOrders = purchaseOrderRepository.findByCreatedAtBetween(startDate.get(), endDate.get(), pageable);
        } else if (id.isPresent()) {
            purchaseOrders = purchaseOrderRepository.findWithDetailsById(id.get())
                    .map(Collections::singletonList)
                    .orElse(Collections.emptyList());
        } else if (status.isPresent()) {
            purchaseOrders = purchaseOrderRepository.findByStatusEquals(status.get(), pageable);
        } else {
            purchaseOrders = purchaseOrderRepository.findAll(pageable).getContent();
        }

        return purchaseOrderMapper.toListPurchaseOrderListResponse(purchaseOrders);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public PurchaseOrderResponse getPurchaseOrder(Integer purchaseOrderId) {
        PurchaseOrder order = purchaseOrderRepository.findWithDetailsById(purchaseOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_ID_NOT_EXISTED));

        List<PurchaseOrderDetail> detail = purchaseOrderDetailRepository.findByPurchaseOrder_Id(purchaseOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_ID_NOT_EXISTED));

        PurchaseOrderResponse response = purchaseOrderMapper.toPurchaseOrderResponse(order);
        response.setDetails(purchaseOrderDetailMapper.toListPurchaseOrderDetailResponse(detail));

        return response;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public PurchaseOrderResponse enterPrice(Integer purchaseOrderId, EnterPricePurchaseOrderRequest request) {
        PurchaseOrder order = purchaseOrderRepository.findWithDetailsById(purchaseOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_ID_NOT_EXISTED));

        if (order.getStatus().equals(PurchaseOrderStatus.IN_PAYMENT.name())
                || order.getStatus().equals(PurchaseOrderStatus.CANCELLED.name())
        ) {
            throw new AppException(ErrorCode.PURCHASE_ORDER_STATUS_NOT_PENDING);
        }

        List<PurchaseOrderDetail> details = purchaseOrderDetailRepository.findAllById(
                request.getDetails().stream().map(EnterPriceDetailRequest::getId).toList()
        );

        Map<Integer, BigDecimal> idToPriceMap = request.getDetails().stream()
                .collect(Collectors.toMap(EnterPriceDetailRequest::getId, EnterPriceDetailRequest::getUnitPrice));

        details.forEach(detail -> {
            if (!detail.getPurchaseOrder().getId().equals(purchaseOrderId)) {
                throw new AppException(ErrorCode.PURCHASE_ORDER_DETAIL_ID_INVALID);
            }

            BigDecimal unitPrice = idToPriceMap.getOrDefault(detail.getId(), detail.getExpectedPrice());
            detail.setUnitPrice(unitPrice);

            detail.setTotalPrice(unitPrice.multiply(detail.getQuantity()));
        });

        BigDecimal totalAmount = details.stream()
                .map(PurchaseOrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        order.setStatus(PurchaseOrderStatus.PRICE_ENTERED.name());

        purchaseOrderDetailRepository.saveAll(details);
        purchaseOrderRepository.save(order);

        return purchaseOrderMapper.toPurchaseOrderResponse(order);
    }

    private Optional<LocalDateTime> parseDate(Object dateParam) {
        if (dateParam instanceof String) {
            try {
                // Assuming your date format is ISO standard, adjust if necessary
                DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
                return Optional.of(LocalDateTime.parse((String) dateParam, formatter));
            } catch (DateTimeParseException e) {
                throw new RuntimeException("Invalid date format: " + dateParam);
            }
        }
        return Optional.empty();
    }

    private Optional<Integer> parseInteger(Object param) {
        if (param instanceof String) {
            try {
                return Optional.of(Integer.parseInt((String) param));
            } catch (NumberFormatException e) {
                // Log the error or handle exception
                return Optional.empty();
            }
        } else if (param instanceof Integer) {
            return Optional.of((Integer) param);
        }
        return Optional.empty();
    }
}

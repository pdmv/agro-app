package com.pdmv.agro.service;

import com.pdmv.agro.dto.request.OrderCreationRequest;
import com.pdmv.agro.dto.request.OrderDetailCreationRequest;
import com.pdmv.agro.dto.response.OrderDetailResponse;
import com.pdmv.agro.dto.response.OrderListResponse;
import com.pdmv.agro.dto.response.OrderResponse;
import com.pdmv.agro.dto.response.PriceListResponse;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.enums.OrderStatus;
import com.pdmv.agro.enums.PaymentMethod;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.mapper.OrderDetailMapper;
import com.pdmv.agro.mapper.OrderMapper;
import com.pdmv.agro.mapper.PriceMapper;
import com.pdmv.agro.pojo.*;
import com.pdmv.agro.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional
public class OrderService {
    OrderRepository orderRepository;
    OrderDetailRepository orderDetailRepository;
    UserInfoRepository userInfoRepository;
    ProductRepository productRepository;
    PriceRepository priceRepository;
    OrderMapper orderMapper;
    OrderDetailMapper orderDetailMapper;
    PriceMapper priceMapper;
    ProductImageRepository productImageRepository;
    InventoryRepository inventoryRepository;

    @PreAuthorize("hasRole('CUSTOMER')")    // Tạm thời
    public OrderResponse create(OrderCreationRequest request) {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        UserInfo customer = userInfoRepository.getUserInfoByAccount_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.ID_NOT_EXISTED));

        Order order = Order.builder()
                .customer(customer)
                .discountAmount(request.getDiscountAmount() == null ? BigDecimal.ZERO : request.getDiscountAmount())
                .shippingAddress(request.getShippingAddress())
                .shippingPhone(request.getShippingPhone())
                .paymentMethod(request.getPaymentMethod() == null ? PaymentMethod.CASH.name() : request.getPaymentMethod())
                .status(request.getStatus() == null ? OrderStatus.PENDING.name() : request.getStatus())
                .note(request.getNote())
                .build();
        orderRepository.save(order);

        List<OrderDetail> orderDetails = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        if (request.getDetails() == null || request.getDetails().isEmpty()) {
            throw new AppException(ErrorCode.ORDER_DETAILS_EMPTY);
        }

        for (OrderDetailCreationRequest detailRequest : request.getDetails()) {
            Price price = priceRepository.findById(detailRequest.getPriceId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRICE_ID_NOT_EXISTED));

            // Tạo OrderDetail
            BigDecimal quantity = detailRequest.getQuantity();
            BigDecimal unitPrice = price.getPrice();
            BigDecimal totalPrice = quantity.multiply(unitPrice);

            OrderDetail orderDetail = OrderDetail.builder()
                    .order(order)
                    .product(price.getProduct())
                    .price(price)
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .build();

            orderDetails.add(orderDetail);

            // Cộng dồn tổng tiền
            totalAmount = totalAmount.add(totalPrice);
        }

        // Cập nhật tổng tiền và net amount cho order
        order.setTotalAmount(totalAmount);
        order.setNetAmount(totalAmount.subtract(order.getDiscountAmount()));

        // Lưu chi tiết đơn hàng vào DB
        orderDetailRepository.saveAll(orderDetails);
        orderRepository.save(order);

        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setDetails(orderDetailMapper.toListOrderDetailResponse(orderDetails));

        return response;
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public OrderResponse get(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ID_NOT_EXISTED));

        // Check role khach hang -> chi xem duoc don hang cua minh
        String username = order.getCustomer().getAccount().getUsername();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        boolean isCustomer = authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_CUSTOMER"));

        if (isCustomer && !order.getCustomer().getAccount().getUsername().equals(username)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        return response(order, details);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public OrderResponse confirm(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ID_NOT_EXISTED));

        if (!order.getStatus().equals(OrderStatus.PENDING.name())) {
            throw new AppException(ErrorCode.ORDER_STATUS_NOT_PENDING);
        }

        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        UserInfo staff = userInfoRepository.getUserInfoByAccount_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.ID_NOT_EXISTED));
        order.setStaff(staff);

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        for (OrderDetail detail : details) {
            Inventory inventory = inventoryRepository.findByProduct_Id(detail.getProduct().getId());

            if (inventory == null) {
                throw new AppException(ErrorCode.INVENTORY_NOT_FOUND);
            }

            BigDecimal availableStock = inventory.getQuantity();
            BigDecimal requestedQuantity = detail.getQuantity();

            if (availableStock.compareTo(requestedQuantity) < 0) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }

            inventory.setQuantity(availableStock.subtract(requestedQuantity));
            inventoryRepository.save(inventory);
        }

        order.setStatus(OrderStatus.CONFIRMED.name());
        orderRepository.save(order);

        return response(order, details);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public OrderResponse shipping(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ID_NOT_EXISTED));

        if (!order.getStatus().equals(OrderStatus.CONFIRMED.name())) {
            throw new AppException(ErrorCode.ORDER_STATUS_NOT_CONFIRMED);
        }

        order.setStatus(OrderStatus.SHIPPING.name());
        orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        return response(order, details);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public OrderResponse delivered(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ID_NOT_EXISTED));

        if (!order.getStatus().equals(OrderStatus.SHIPPING.name())) {
            throw new AppException(ErrorCode.ORDER_STATUS_NOT_SHIPPING);
        }

        order.setStatus(OrderStatus.DELIVERED.name());
        orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        return response(order, details);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')") // xử lý cho COD
    public OrderResponse paid(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ID_NOT_EXISTED));

        if (!order.getStatus().equals(OrderStatus.DELIVERED.name())) {
            throw new AppException(ErrorCode.ORDER_STATUS_NOT_DELIVERED);
        }

        order.setStatus(OrderStatus.PAID.name());
        orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        return response(order, details);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER')")
    public List<OrderListResponse> getOwnOrder(Pageable pageable) {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        UserInfo customer = userInfoRepository.getUserInfoByAccount_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.ID_NOT_EXISTED));

        List<Order> orders = orderRepository.findByCustomer_Id(customer.getId(), pageable);

        return orderMapper.toListOrderListResponse(orders);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public List<OrderListResponse> findOrders(Map<String, Object> params, Pageable pageable) {
        Optional<String> customerName = Optional.ofNullable((String) params.get("customerName"));
        Optional<String> staffName = Optional.ofNullable((String) params.get("staffName"));
        Optional<String> status = Optional.ofNullable((String) params.get("status"));
        Optional<LocalDateTime> startDate = parseDate(params.get("startDate"));
        Optional<LocalDateTime> endDate = parseDate(params.get("endDate"));
        Optional<Integer> id = parseInteger(params.get("id"));

        List<Order> orders;

        if (customerName.isPresent()) {
            if (startDate.isPresent() && endDate.isPresent()) {
                orders = orderRepository.findByCreatedAtBetweenAndCustomer_FirstnameContainingIgnoreCaseOrCustomer_LastnameContainingIgnoreCase(
                        startDate.get(), endDate.get(), customerName.get(), customerName.get(), pageable);
            } else {
                orders = orderRepository.findByCustomer_FirstnameContainingIgnoreCaseOrCustomer_LastnameContainingIgnoreCase(
                        customerName.get(), customerName.get(), pageable);
            }
        }
        else if (staffName.isPresent()) {
            if (startDate.isPresent() && endDate.isPresent()) {
                orders = orderRepository.findByCreatedAtBetweenAndStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
                        startDate.get(), endDate.get(), staffName.get(), staffName.get(), pageable);
            } else {
                orders = orderRepository.findByStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
                        staffName.get(), staffName.get(), pageable);
            }
        }
        else if (startDate.isPresent() && endDate.isPresent()) {
            orders = orderRepository.findByCreatedAtBetween(startDate.get(), endDate.get(), pageable);
        }
        else if (id.isPresent()) {
            orders = orderRepository.findById(id.get())
                    .map(Collections::singletonList)
                    .orElse(Collections.emptyList());
        }
        else {
            orders = orderRepository.findAll(pageable).getContent();
        }

        if (status.isPresent()) {
            orders = orders.stream()
                    .filter(order -> order.getStatus().equalsIgnoreCase(status.get()))
                    .collect(Collectors.toList());
        }

        return orderMapper.toListOrderListResponse(orders);
    }

    public OrderResponse cancel(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ID_NOT_EXISTED));

        if (!order.getStatus().equals(OrderStatus.PENDING.name())) {
            throw new AppException(ErrorCode.ORDER_STATUS_NOT_PENDING);
        }

        order.setStatus(OrderStatus.CANCELLED.name());
        orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);

        return response(order, details);
    }

//    public OrderResponse update();

    private OrderResponse response(Order order, List<OrderDetail> details) {
        List<OrderDetailResponse> orderDetailResponses = new ArrayList<>();

        for (OrderDetail detail : details) {
            PriceListResponse priceResponse = priceMapper.toPriceListResponse(detail.getPrice());
            priceResponse.setProductPrimaryImage(productImageRepository
                    .findByProduct_IdAndIsPrimary(detail.getPrice().getProduct().getId(), true)
                    .getImageUrl());

            OrderDetailResponse orderDetailResponse = orderDetailMapper.toOrderDetailResponse(detail);
            orderDetailResponse.setPrice(priceResponse);
            orderDetailResponses.add(orderDetailResponse);
        }

        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setDetails(orderDetailResponses);

        return response;
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

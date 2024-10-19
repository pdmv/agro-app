package com.pdmv.agro.service;

import com.pdmv.agro.dto.response.InventoryResponse;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.enums.PurchaseOrderStatus;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.mapper.InventoryMapper;
import com.pdmv.agro.pojo.Inventory;
import com.pdmv.agro.pojo.PurchaseOrder;
import com.pdmv.agro.pojo.PurchaseOrderDetail;
import com.pdmv.agro.repository.InventoryRepository;
import com.pdmv.agro.repository.PurchaseOrderDetailRepository;
import com.pdmv.agro.repository.PurchaseOrderRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional
public class InventoryService {
    InventoryRepository inventoryRepository;
    InventoryMapper inventoryMapper;
    PurchaseOrderRepository purchaseOrderRepository;
    PurchaseOrderDetailRepository purchaseOrderDetailRepository;

    public void importProduct(Integer purchaseOrderId) {
        // Tải đơn đặt hàng cùng với chi tiết và sản phẩm liên quan trong một truy vấn
        PurchaseOrder order = purchaseOrderRepository.findById(purchaseOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_ID_NOT_EXISTED));

        if (!order.getStatus().equals(PurchaseOrderStatus.PENDING.name())) {
            throw new AppException(ErrorCode.PURCHASE_ORDER_STATUS_NOT_PENDING);
        }

        List<PurchaseOrderDetail> details = purchaseOrderDetailRepository
                .findPurchaseOrderDetailsByPurchaseOrder_Id(purchaseOrderId);

        List<Integer> productIds = details.stream()
                .map(detail -> detail.getProduct().getId())
                .collect(Collectors.toList());

        // Lấy tất cả kho hàng liên quan đến các sản phẩm trong đơn đặt hàng
        List<Inventory> inventories = inventoryRepository.findByProduct_IdIn(productIds);

        details.forEach(detail -> {
            Inventory inventory = inventories.stream()
                    .filter(inv -> inv.getProduct().getId().equals(detail.getProduct().getId()))
                    .findFirst()
                    .orElse(null);

            if (Objects.isNull(inventory)) {
                Inventory newInventory = Inventory.builder()
                        .product(detail.getProduct())
                        .quantity(detail.getQuantity())
                        .build();
                inventoryRepository.save(newInventory);
            } else {
                inventory.setQuantity(BigDecimal.valueOf(inventory.getQuantity().floatValue() + detail.getQuantity().floatValue()));
            }
        });

        // Cập nhật trạng thái của đơn đặt hàng
        order.setStatus(PurchaseOrderStatus.IMPORTED.name());
        purchaseOrderRepository.save(order);

        // Lưu lại toàn bộ kho hàng đã cập nhật
        inventoryRepository.saveAll(inventories);
    }

    public InventoryResponse getInventoryByProductId(Integer productId) {
        return inventoryMapper.toInventoryResponse(inventoryRepository.findByProduct_Id(productId));
    }

    public List<InventoryResponse> getInventories() {
        return inventoryRepository.findAll().stream()
                .map(inventoryMapper::toInventoryResponse)
                .collect(Collectors.toList());
    }

    public void exportProduct(Integer productId, BigDecimal quantity) {
        Inventory inventory = inventoryRepository.findByProduct_Id(productId);

        if (inventory == null) {
            throw new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED);
        }

        if (inventory.getQuantity().compareTo(quantity) < 0) {
            throw new AppException(ErrorCode.QUANTITY_NOT_ENOUGH_IN_INVENTORY);
        }

        inventory.setQuantity(inventory.getQuantity().subtract(quantity));
        inventoryRepository.save(inventory);
    }

    public boolean isQuantityEnough(Integer productId, BigDecimal quantity) {
        Inventory inventory = inventoryRepository.findByProduct_Id(productId);

        if (inventory == null) {
            throw new AppException(ErrorCode.PRODUCT_ID_NOT_EXISTED);
        }

        return inventory.getQuantity().compareTo(quantity) >= 0;
    }
}

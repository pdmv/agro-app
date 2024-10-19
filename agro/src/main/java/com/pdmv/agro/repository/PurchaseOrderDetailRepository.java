package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.PurchaseOrderDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderDetailRepository extends JpaRepository<PurchaseOrderDetail, Integer> {
    Optional<PurchaseOrderDetail> findByPurchaseOrder_IdAndProduct_Id(Integer purchaseOrderId, Integer productId);
    Optional<List<PurchaseOrderDetail>> findByPurchaseOrder_Id(Integer purchaseOrderId);
    @EntityGraph("PurchaseOrderDetail.details")
    List<PurchaseOrderDetail> findPurchaseOrderDetailsByPurchaseOrder_Id(Integer purchaseOrderId);
}

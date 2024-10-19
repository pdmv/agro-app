package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.PurchaseOrder;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
    @EntityGraph("PurchaseOrder.details")
    Optional<PurchaseOrder> findWithDetailsById(Integer id);

    @EntityGraph("PurchaseOrder.details")
    List<PurchaseOrder> findBySupplier_NameContainingIgnoreCase(String name, Pageable pageable);

    @EntityGraph("PurchaseOrder.details")
    List<PurchaseOrder> findByStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
            String firstname,
            String lastname,
            Pageable pageable
    );

    @EntityGraph("PurchaseOrder.details")
    List<PurchaseOrder> findByCreatedAtBetween(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    );

    @EntityGraph("PurchaseOrder.details")
    List<PurchaseOrder> findByCreatedAtBetweenAndSupplier_NameContainingIgnoreCase(
            LocalDateTime startDate,
            LocalDateTime endDate,
            String name,
            Pageable pageable
    );

    @EntityGraph("PurchaseOrder.details")
    List<PurchaseOrder> findByCreatedAtBetweenAndStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
            LocalDateTime startDate,
            LocalDateTime endDate,
            String firstname,
            String lastname,
            Pageable pageable
    );

    @EntityGraph("PurchaseOrder.details")
    List<PurchaseOrder> findByStatusEquals(String status, Pageable pageable);

    @EntityGraph("PurchaseOrder.details")
    List<PurchaseOrder> findByStatusEqualsAndSupplier_NameContainingIgnoreCase(
            String status,
            String name,
            Pageable pageable
    );

    @EntityGraph("PurchaseOrder.details")
    List<PurchaseOrder> findBySupplier_IdAndStatusEquals(
            Integer id,
            String status,
            Pageable pageable
    );
}

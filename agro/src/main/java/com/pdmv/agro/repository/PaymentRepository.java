package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Payment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    @EntityGraph("Payment.details")
    Optional<Payment> findWithDetailsById(Integer id);

    @EntityGraph("Payment.details")
    List<Payment> findBySupplier_NameContainingIgnoreCase(String name, Pageable pageable);

    @EntityGraph("Payment.details")
    List<Payment> findByStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
            String firstname,
            String lastname,
            Pageable pageable
    );

    @EntityGraph("Payment.details")
    List<Payment> findByCreatedAtBetween(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    );

    @EntityGraph("Payment.details")
    List<Payment> findByCreatedAtBetweenAndSupplier_NameContainingIgnoreCase(
            LocalDateTime startDate,
            LocalDateTime endDate,
            String name,
            Pageable pageable
    );

    @EntityGraph("Payment.details")
    List<Payment> findByCreatedAtBetweenAndStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
            LocalDateTime startDate,
            LocalDateTime endDate,
            String firstname,
            String lastname,
            Pageable pageable
    );

    @EntityGraph("Payment.details")
    List<Payment> findByStatusEquals(String status, Pageable pageable);

    @EntityGraph("Payment.details")
    List<Payment> findByTotalAmountBetween(BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable);
}

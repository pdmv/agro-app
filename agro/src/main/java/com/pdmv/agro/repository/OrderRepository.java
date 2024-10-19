package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomer_Id(Integer customerId, Pageable pageable);

    @EntityGraph("Order.details")
    List<Order> findByCustomer_FirstnameContainingIgnoreCaseOrCustomer_LastnameContainingIgnoreCase(
            String firstname,
            String lastname,
            Pageable pageable
    );

    @EntityGraph("Order.details")
    List<Order> findByStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
            String firstname,
            String lastname,
            Pageable pageable
    );

    @EntityGraph("Order.details")
    List<Order> findByCreatedAtBetween(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    );

    @EntityGraph("Order.details")
    List<Order> findByCreatedAtBetweenAndCustomer_FirstnameContainingIgnoreCaseOrCustomer_LastnameContainingIgnoreCase(
            LocalDateTime startDate,
            LocalDateTime endDate,
            String firstname,
            String lastname,
            Pageable pageable
    );

    @EntityGraph("Order.details")
    List<Order> findOrdersByStatusIgnoreCase(String status);

    @EntityGraph("Order.details")
    List<Order> findByCreatedAtBetweenAndStaff_FirstnameContainingIgnoreCaseOrStaff_LastnameContainingIgnoreCase(
            LocalDateTime localDateTime,
            LocalDateTime localDateTime1,
            String firstname,
            String lastname,
            Pageable pageable
    );
}

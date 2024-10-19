package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.OrderDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    @EntityGraph("OrderDetail.details")
    List<OrderDetail> findByOrderId(Integer orderId);
}

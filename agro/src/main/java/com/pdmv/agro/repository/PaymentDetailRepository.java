package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.PaymentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentDetailRepository extends JpaRepository<PaymentDetail, Integer> {
    List<PaymentDetail> findByPaymentId(Integer paymentId);
}

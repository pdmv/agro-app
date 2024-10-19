package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Price;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PriceRepository extends JpaRepository<Price, Integer> {
    @EntityGraph("Price.details")
    Price findByProduct_Id(Integer productId);

    @EntityGraph("Price.details")
    List<Price> findByEffectiveDate(LocalDate effectiveDate, Pageable pageable);
    @EntityGraph("Price.details")
    List<Price> findByEffectiveDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    @EntityGraph("Price.details")
    List<Price> findByEffectiveDateAfter(LocalDate startDate, Pageable pageable);
    @EntityGraph("Price.details")
    List<Price> findByEffectiveDateBefore(LocalDate endDate, Pageable pageable);
    @EntityGraph("Price.details")
    List<Price> findByItemNameContaining(String itemName, Pageable pageable);
    @EntityGraph("Price.details")
    List<Price> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    @EntityGraph("Price.details")
    List<Price> findByPriceGreaterThanEqual(BigDecimal minPrice, Pageable pageable);
    @EntityGraph("Price.details")
    List<Price> findByPriceLessThanEqual(BigDecimal maxPrice, Pageable pageable);
}

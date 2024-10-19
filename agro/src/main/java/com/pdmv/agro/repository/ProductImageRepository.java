package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProduct_Id(Integer productId);
    ProductImage findByProduct_IdAndIsPrimary(Integer productId, Boolean isPrimary);

}

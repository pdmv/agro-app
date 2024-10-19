package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByName(String name);
    List<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Optional<Product> getProductsById(Integer id);
}

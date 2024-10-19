package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Supplier;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    boolean existsByName(String name);
    List<Supplier> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Supplier> findByPhoneNumberContainingIgnoreCase(String phoneNumber, Pageable pageable);
    Optional<Supplier> getSuppliersById(Integer id);
}

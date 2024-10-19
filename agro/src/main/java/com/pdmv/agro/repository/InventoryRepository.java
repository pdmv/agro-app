package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    Inventory findByProduct_Id(Integer productId);
    List<Inventory> findByProduct_IdIn(List<Integer> productIds);
}

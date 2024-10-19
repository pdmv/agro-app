package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    boolean existsByUsername(String username);
    Optional<Account> findAccountByUsername(String username);
}

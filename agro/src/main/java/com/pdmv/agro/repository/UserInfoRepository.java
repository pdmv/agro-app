package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Account;
import com.pdmv.agro.pojo.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {
    Optional<UserInfo> findByAccount(Account account);
    Optional<UserInfo> getUserInfoById(Integer id);
    boolean existsByEmail(String email);
}

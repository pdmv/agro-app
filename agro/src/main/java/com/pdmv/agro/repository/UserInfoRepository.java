package com.pdmv.agro.repository;

import com.pdmv.agro.pojo.Account;
import com.pdmv.agro.pojo.UserInfo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {
    Optional<UserInfo> findByAccount(Account account);
    @EntityGraph("UserInfo.account")
    Optional<UserInfo> getUserInfoById(Integer id);
    Optional<UserInfo> getUserInfoByAccount_Username(String username);
    boolean existsByEmail(String email);
    @EntityGraph("UserInfo.account")
    List<UserInfo> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
            String firstname,
            String lastname,
            Pageable pageable
    );
    @EntityGraph("UserInfo.account")
    List<UserInfo> findByPhoneNumberContaining(String phoneNumber, Pageable pageable);
    @EntityGraph("UserInfo.account")
    List<UserInfo> findByEmailContaining(String email, Pageable pageable);
    @EntityGraph("UserInfo.account")
    List<UserInfo> findByAddressContaining(String address, Pageable pageable);
    @EntityGraph("UserInfo.account")
    List<UserInfo> findByAccount_Username(String username, Pageable pageable);
    @EntityGraph("UserInfo.account")
    List<UserInfo> findByAccount_Role(String role, Pageable pageable);
}

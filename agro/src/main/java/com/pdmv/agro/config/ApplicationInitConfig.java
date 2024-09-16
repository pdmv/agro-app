package com.pdmv.agro.config;

import com.pdmv.agro.enums.Role;
import com.pdmv.agro.pojo.Account;
import com.pdmv.agro.repository.AccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(AccountRepository accountRepository) {
        return args -> {
            if (!accountRepository.existsByUsername("admin")) {
                Account admin = Account.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("Admin@123"))
                        .role(Role.ADMIN.toString())
                        .build();

                accountRepository.save(admin);
                log.warn("Admin user has been created with default password: Admin@123, please change it!");
            }
        };
    }
}

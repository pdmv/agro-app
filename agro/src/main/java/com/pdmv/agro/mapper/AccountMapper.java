package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.request.AccountCreationRequest;
import com.pdmv.agro.dto.response.AccountResponse;
import com.pdmv.agro.pojo.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    Account toEntity(AccountCreationRequest request);
    AccountResponse toDto(Account account);
}

package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.request.UserCreationRequest;
import com.pdmv.agro.dto.response.UserResponse;
import com.pdmv.agro.pojo.UserInfo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserInfoMapper {
    UserInfo toEntity(UserCreationRequest dto);
    UserResponse toDto(UserInfo user);
}

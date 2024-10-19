package com.pdmv.agro.mapper;

import com.pdmv.agro.dto.request.ChangeProfileRequest;
import com.pdmv.agro.dto.request.ChangeRoleProfileRequest;
import com.pdmv.agro.dto.request.RoleUserCreationRequest;
import com.pdmv.agro.dto.request.UserCreationRequest;
import com.pdmv.agro.dto.response.*;
import com.pdmv.agro.pojo.UserInfo;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserInfoMapper {
    UserInfo toUserInfo(UserCreationRequest dto);
    UserInfo toUserInfo(RoleUserCreationRequest dto);
    UserResponse toUserResponse(UserInfo user);
    ChangeProfileResponse toChangeProfileResponse(UserInfo user);
    ChangeRoleProfileRequest toChangeRoleProfileResponse(UserInfo user);
    List<UserListResponse> toListDto(List<UserInfo> users);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(ChangeProfileRequest request, @MappingTarget UserInfo entity);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(ChangeRoleProfileRequest request, @MappingTarget UserInfo entity);
    PurchaseOrderStaff toPurchaseOrderStaff(UserInfo user);
    CustomerResponse toCustomerResponse(UserInfo user);
}

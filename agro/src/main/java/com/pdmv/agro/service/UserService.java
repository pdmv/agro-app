package com.pdmv.agro.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;
import com.pdmv.agro.dto.request.ChangeAvatarRequest;
import com.pdmv.agro.dto.request.UserCreationRequest;
import com.pdmv.agro.dto.response.UserResponse;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.enums.Role;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.mapper.UserInfoMapper;
import com.pdmv.agro.pojo.Account;
import com.pdmv.agro.pojo.UserInfo;
import com.pdmv.agro.repository.AccountRepository;
import com.pdmv.agro.repository.UserInfoRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserInfoRepository userInfoRepository;
    AccountRepository accountRepository;
    UserInfoMapper userInfoMapper;
    PasswordEncoder passwordEncoder;
    CloudinaryService cloudinaryService;
    private final Cloudinary cloudinary;

    public UserResponse create(UserCreationRequest request) {
        if (accountRepository.existsByUsername(request.getAccount().getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        UserInfo user = userInfoMapper.toEntity(request);
        Account account = user.getAccount();

        // Mã hoá mật khẩu
        account.setPassword(passwordEncoder.encode(account.getPassword()));

        // Set role
        account.setRole(Role.CUSTOMER.toString());

        accountRepository.save(account);
        userInfoRepository.save(user);

        return userInfoMapper.toDto(user);
    }

    public void changeAvatar(ChangeAvatarRequest request) {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        // Xoá ảnh đại diện nếu đã có
        if (account.getAvatarUrl() != null || account.getAvatarPublicId() != null) {
            try {
                ApiResponse apiResponse = cloudinary.api().deleteResources(Arrays.asList(account.getAvatarPublicId()),
                        ObjectUtils.asMap("type", "upload", "resource_type", "image"));
//                System.out.println(apiResponse);
            } catch (Exception exception) {
                throw new AppException(ErrorCode.DELETE_FAILED);
            }
        }

        // Upload ảnh đại diện
        Map data = cloudinaryService.upload(request.getAvatar());
        account.setAvatarUrl(data.get("secure_url").toString());
        account.setAvatarPublicId(data.get("public_id").toString());

        accountRepository.save(account);
    }
}

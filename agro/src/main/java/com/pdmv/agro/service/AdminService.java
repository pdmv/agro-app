package com.pdmv.agro.service;

import com.pdmv.agro.dto.request.ChangeAvatarRequest;
import com.pdmv.agro.dto.request.ChangeRoleProfileRequest;
import com.pdmv.agro.dto.request.RoleUserCreationRequest;
import com.pdmv.agro.dto.response.UserListResponse;
import com.pdmv.agro.dto.response.UserResponse;
import com.pdmv.agro.enums.ErrorCode;
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
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminService {
    UserInfoRepository userInfoRepository;
    AccountRepository accountRepository;
    UserInfoMapper userInfoMapper;
    PasswordEncoder passwordEncoder;
    CloudinaryService cloudinaryService;

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public UserResponse create(RoleUserCreationRequest request) {
        UserInfo user = userInfoMapper.toUserInfo(request);
        checkEmail(request.getEmail());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        boolean isOwner = authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_OWNER"));

        String targetUserRole = user.getAccount().getRole();

        if (isOwner && !("STAFF".equals(targetUserRole))) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Account account = user.getAccount();
        createAccount(account, request.getAccount().getRole());
        accountRepository.save(account);

        userInfoRepository.save(user);
        return userInfoMapper.toUserResponse(user);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public UserResponse getProfile(Integer userId) {
        UserInfo info = userInfoRepository.getUserInfoById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.ID_NOT_EXISTED));

        // Check context holder OWNER role không được xem info ADMIN, CUSTOMER
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        boolean isOwner = authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_OWNER"));

        String targetUserRole = info.getAccount().getRole();

        if (isOwner && ("ADMIN".equals(targetUserRole) || "CUSTOMER".equals(targetUserRole))) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return userInfoMapper.toUserResponse(info);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ChangeRoleProfileRequest changeProfile(Integer userInfoId, ChangeRoleProfileRequest request) {
        if (!Objects.isNull(request.getAccount().getPassword())) {
            request.getAccount().setPassword(passwordEncoder.encode(request.getAccount().getPassword()));
        }

        UserInfo info = userInfoRepository.getUserInfoById(userInfoId)
                .orElseThrow(() -> new AppException(ErrorCode.ID_NOT_EXISTED));

        if (!Objects.isNull(request.getAccount().getUsername())) {
            if (!info.getAccount().getUsername().equals(request.getAccount().getUsername()))
                checkUsername(request.getAccount().getUsername());
        }

        userInfoMapper.partialUpdate(request, info);
        userInfoRepository.save(info);

        return userInfoMapper.toChangeRoleProfileResponse(info);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'STAFF')")
    public List<UserListResponse> getUsers(Map<String, String> params, Pageable pageable) {
//        log.info(SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString());
        List<UserInfo> users = null;

        if (Objects.isNull(params)) {
            users = userInfoRepository.findAll(pageable).stream().toList();
        } else if (params.containsKey("name")) {
            String name = params.get("name");
            users = userInfoRepository
                    .findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(name, name, pageable);
        } else if (params.containsKey("phoneNumber")) {
            String phoneNumber = params.get("phoneNumber");
            users = userInfoRepository.findByPhoneNumberContaining(phoneNumber, pageable);
        } else if (params.containsKey("email")) {
            String email = params.get("email");
            users = userInfoRepository.findByEmailContaining(email, pageable);
        } else if (params.containsKey("address")) {
            String address = params.get("address");
            users = userInfoRepository.findByAddressContaining(address, pageable);
        } else if (params.containsKey("username")) {
            String username = params.get("username");
            users = userInfoRepository.findByAccount_Username(username, pageable);
        } else if (params.containsKey("role")) {
            String role = params.get("role");
            users = userInfoRepository.findByAccount_Role(role, pageable);
        }

        return userInfoMapper.toListDto(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void changeAvatar(Integer userId, ChangeAvatarRequest request) {
        UserInfo info = userInfoRepository.getUserInfoById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.ID_NOT_EXISTED));

        Account account = info.getAccount();

        // Xoá ảnh đại diện nếu đã có
        deleteExistedAvatar(account);

        // Upload ảnh đại diện
        uploadAccountAvatar(account, request.getAvatar());

        accountRepository.save(account);
    }

    private void createAccount(Account account, String role) {
        checkUsername(account.getUsername());

        // Encode password
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        // Set role
        account.setRole(role);
    }

    private void checkUsername(String username) {
        if (accountRepository.existsByUsername(username)) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
    }

    private void checkEmail(String email) {
        if (userInfoRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
    }

    private void deleteExistedAvatar(Account account) {
        if (account.getAvatarPublicId() != null) {
            cloudinaryService.deleteAsync(account.getAvatarPublicId());
        }
    }

    private void uploadAccountAvatar(Account account, MultipartFile avatar) {
        Map data = cloudinaryService.upload(avatar);
        account.setAvatarUrl(data.get("secure_url").toString());
        account.setAvatarPublicId(data.get("public_id").toString());
    }
}

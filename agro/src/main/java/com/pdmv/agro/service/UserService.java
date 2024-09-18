package com.pdmv.agro.service;

import com.pdmv.agro.dto.request.*;
import com.pdmv.agro.dto.response.ChangeProfileResponse;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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

    public UserResponse create(UserCreationRequest request) {
        UserInfo user = userInfoMapper.toUserInfo(request);
        checkEmail(request.getEmail());

        Account account = user.getAccount();
        createAccount(account, Role.CUSTOMER.name());
        accountRepository.save(account);

        userInfoRepository.save(user);

        return userInfoMapper.toUserResponse(user);
    }

    public void changeAvatar(ChangeAvatarRequest request) {
        Account account = getContextHolderAccount();

        // Xoá ảnh đại diện nếu đã có
        deleteExistedAvatar(account);

        // Upload ảnh đại diện
        uploadAccountAvatar(account, request.getAvatar());

        accountRepository.save(account);
    }

    public void changePassword(ChangePasswordRequest request) {
        Account account = getContextHolderAccount();

        if (passwordEncoder.matches(request.getOldPassword(), account.getPassword())) {
            account.setPassword(passwordEncoder.encode(request.getNewPassword()));
            accountRepository.save(account);
        } else {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCHED);
        }
    }

    public UserResponse getProfile() {
        Account account = getContextHolderAccount();
        UserInfo info = getContextUserInfo(account);

        return userInfoMapper.toUserResponse(info);
    }


    public ChangeProfileResponse changeProfile(ChangeProfileRequest request) {
        Account account = getContextHolderAccount();
        UserInfo info = getContextUserInfo(account);

        userInfoMapper.partialUpdate(request, info);
        userInfoRepository.save(info);

        return userInfoMapper.toChangeProfileResponse(info);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse create(RoleUserCreationRequest request) {
        UserInfo user = userInfoMapper.toUserInfo(request);
        checkEmail(request.getEmail());

        Account account = user.getAccount();
        createAccount(account, request.getAccount().getRole());
        accountRepository.save(account);

        userInfoRepository.save(user);
        return userInfoMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getProfile(Integer userId) {
        UserInfo info = userInfoRepository.getUserInfoById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.ID_NOT_EXISTED));

        return userInfoMapper.toUserResponse(info);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ChangeProfileResponse changeProfile(Integer userInfoId, ChangeProfileRequest request) {
        UserInfo info = userInfoRepository.getUserInfoById(userInfoId)
                .orElseThrow(() -> new AppException(ErrorCode.ID_NOT_EXISTED));

        userInfoMapper.partialUpdate(request, info);
        userInfoRepository.save(info);

        return userInfoMapper.toChangeProfileResponse(info);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
//        log.info(SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString());

        List<UserInfo> users = userInfoRepository.findAll().stream().toList();
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

    private Account getContextHolderAccount() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }

    private UserInfo getContextUserInfo(Account contextAccount) {
        return userInfoRepository.findByAccount(contextAccount)
                .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));
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
            cloudinaryService.deleteAvatarAsync(account.getAvatarPublicId());
        }
    }

    private void uploadAccountAvatar(Account account, MultipartFile avatar) {
        Map data = cloudinaryService.upload(avatar);
        account.setAvatarUrl(data.get("secure_url").toString());
        account.setAvatarPublicId(data.get("public_id").toString());
    }
}

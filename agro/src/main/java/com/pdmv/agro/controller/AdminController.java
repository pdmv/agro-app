package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.ChangeAvatarRequest;
import com.pdmv.agro.dto.request.ChangeRoleProfileRequest;
import com.pdmv.agro.dto.request.RoleUserCreationRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.dto.response.UserListResponse;
import com.pdmv.agro.dto.response.UserResponse;
import com.pdmv.agro.service.AdminService;
import com.pdmv.agro.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {
    UserService userService;
    AdminService adminService;

    @GetMapping("/users")
    ApiResponse<List<UserListResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false) Map<String, String> params
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return ApiResponse.<List<UserListResponse>>builder()
                .result(adminService.getUsers(params, pageable))
                .build();
    }

    @GetMapping("/profile")
    ApiResponse<UserResponse> getProfile(@RequestParam(required = false) Integer userId) {
        UserResponse profile = (userId == null)
                ? userService.getProfile()
                : adminService.getProfile(userId);

        return ApiResponse.<UserResponse>builder()
                .result(profile)
                .build();
    }

    @PostMapping("/users")
    ApiResponse<UserResponse> createRoleUser(@RequestBody @Valid RoleUserCreationRequest request) {
        ApiResponse<UserResponse> response = new ApiResponse<>();

        response.setResult(adminService.create(request));

        return response;
    }

    @PostMapping("/change-profile")
    ApiResponse<ChangeRoleProfileRequest> changeProfile(
            @RequestParam Integer userId, @RequestBody @Valid ChangeRoleProfileRequest request) {
        ApiResponse<ChangeRoleProfileRequest> response = new ApiResponse<>();

        response.setResult(adminService.changeProfile(userId, request));

        return response;
    }

    @PostMapping(value = "/change-avatar", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    ApiResponse changeAvatar(
            @RequestParam Integer userId, @RequestPart("avatar") MultipartFile avatar) {
        ChangeAvatarRequest request = ChangeAvatarRequest.builder()
                .avatar(avatar)
                .build();
        adminService.changeAvatar(userId, request);

        return ApiResponse.builder()
                .message("Avatar has changed.")
                .build();
    }


}

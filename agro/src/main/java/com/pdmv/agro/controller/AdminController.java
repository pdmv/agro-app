package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.ChangeAvatarRequest;
import com.pdmv.agro.dto.request.ChangeProfileRequest;
import com.pdmv.agro.dto.request.RoleUserCreationRequest;
import com.pdmv.agro.dto.response.ApiResponse;
import com.pdmv.agro.dto.response.ChangeProfileResponse;
import com.pdmv.agro.dto.response.UserResponse;
import com.pdmv.agro.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {
    UserService userService;

    @PostMapping()
    ApiResponse<UserResponse> createRoleUser(@RequestBody @Valid RoleUserCreationRequest request) {
        ApiResponse<UserResponse> response = new ApiResponse<>();

        response.setResult(userService.create(request));

        return response;
    }

    @PostMapping("/change-profile")
    ApiResponse<ChangeProfileResponse> changeProfile(
            @RequestParam Integer userId, @RequestBody @Valid ChangeProfileRequest request) {
        ApiResponse<ChangeProfileResponse> response = new ApiResponse<>();

        response.setResult(userService.changeProfile(userId, request));

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
        userService.changeAvatar(userId, request);

        return ApiResponse.builder()
                .message("Avatar has changed.")
                .build();
    }
}

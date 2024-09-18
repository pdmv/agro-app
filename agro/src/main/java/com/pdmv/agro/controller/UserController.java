package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.ChangeAvatarRequest;
import com.pdmv.agro.dto.request.ChangePasswordRequest;
import com.pdmv.agro.dto.request.ChangeProfileRequest;
import com.pdmv.agro.dto.request.UserCreationRequest;
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

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @PostMapping()
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        ApiResponse<UserResponse> response = new ApiResponse<>();

        response.setResult(userService.create(request));

        return response;
    }

    @PostMapping(value = "/change-avatar", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    ApiResponse changeAvatar(@RequestPart("avatar") MultipartFile avatar) {
        ChangeAvatarRequest request = ChangeAvatarRequest.builder()
                .avatar(avatar)
                .build();
        userService.changeAvatar(request);

        return ApiResponse.builder()
                .message("Avatar has changed.")
                .build();
    }

    @GetMapping("/profile")
    ApiResponse<UserResponse> getProfile(@RequestParam(required = false) Integer userId) {
        UserResponse profile = (userId == null)
                ? userService.getProfile()
                : userService.getProfile(userId);

        return ApiResponse.<UserResponse>builder()
                .result(profile)
                .build();
    }

    @PostMapping("/change-password")
    ApiResponse changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(request);

        return ApiResponse.builder()
                .message("Password has changed.")
                .build();
    }

    @PostMapping("/change-profile")
    ApiResponse<ChangeProfileResponse> changeProfile(@RequestBody @Valid ChangeProfileRequest request) {
        ApiResponse<ChangeProfileResponse> response = new ApiResponse<>();

        response.setResult(userService.changeProfile(request));

        return response;
    }
}

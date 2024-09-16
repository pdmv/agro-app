package com.pdmv.agro.controller;

import com.pdmv.agro.dto.request.ChangeAvatarRequest;
import com.pdmv.agro.dto.request.UserCreationRequest;
import com.pdmv.agro.dto.response.ApiResponse;
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
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping()
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        ApiResponse<UserResponse> response = new ApiResponse<>();

        response.setResult(userService.create(request));


        return response;
    }

    @PostMapping(value = "/change-avatar", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE
    }, produces = {
            MediaType.APPLICATION_JSON_VALUE
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
}

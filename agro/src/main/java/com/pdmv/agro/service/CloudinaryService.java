package com.pdmv.agro.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.exception.AppException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CloudinaryService {
    Cloudinary cloudinary;

    public Map upload(MultipartFile file) {
        try {
            Map data = this.cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return data;
        } catch (IOException e) {
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }

    public void deleteAsync(String publicId) {
        CompletableFuture.runAsync(() -> {
            try {
                ApiResponse apiResponse = cloudinary.api().deleteResources(Arrays.asList(publicId),
                        ObjectUtils.asMap("type", "upload", "resource_type", "image"));
//                System.out.println(apiResponse);
            } catch (Exception exception) {
                log.error(exception.getMessage());
            }
        });
    }
}

package com.pdmv.agro.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {
    @Size(min = 6, max = 255, message = "INVALID_PASSWORD")
    String oldPassword;
    @Size(min = 6, max = 255, message = "INVALID_PASSWORD")
    String newPassword;
}

package com.pdmv.agro.dto.request;

import com.pdmv.agro.enums.Role;
import com.pdmv.agro.validator.EnumConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleAccountCreationRequest {
    @Size(min = 4, max = 25, message = "INVALID_USERNAME")
    String username;
    @Size(min = 6, max = 255, message = "INVALID_PASSWORD")
    String password;
    @NotNull(message = "ROLE_IS_NULL")
    @EnumConstraint(enumClass = Role.class, message = "INVALID_ROLE")
    String role;
}

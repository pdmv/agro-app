package com.pdmv.agro.dto.request;

import com.pdmv.agro.validator.PhoneNumberConstraint;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierRequest {
    @Size(min = 1, max = 255, message = "INVALID_SUPPLIER_NAME")
    String name;
    @PhoneNumberConstraint
    String phoneNumber;;
    String address;
}

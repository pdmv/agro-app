package com.pdmv.agro.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierResponse {
    Integer id;
    String name;
    String phoneNumber;;
    String address;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean active;
}

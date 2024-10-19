package com.pdmv.agro.dto.response;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Integer id;
    String name;
    String description;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean active;
}

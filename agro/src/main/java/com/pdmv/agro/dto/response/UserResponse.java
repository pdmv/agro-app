package com.pdmv.agro.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Integer id;
    String firstname;
    String lastname;
    String address;
    String phoneNumber;
    String gender;
    LocalDate dob;
    String email;
    AccountResponse account;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean active;
}

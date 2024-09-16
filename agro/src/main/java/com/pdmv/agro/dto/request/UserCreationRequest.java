package com.pdmv.agro.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String firstname;
    String lastname;
    String address;
    String phoneNumber;
    String gender;
    LocalDate dob;
    String email;
    AccountCreationRequest account;
}

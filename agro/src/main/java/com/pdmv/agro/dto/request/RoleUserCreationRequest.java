package com.pdmv.agro.dto.request;

import com.pdmv.agro.enums.Gender;
import com.pdmv.agro.validator.DobConstraint;
import com.pdmv.agro.validator.EnumConstraint;
import com.pdmv.agro.validator.PhoneNumberConstraint;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleUserCreationRequest {
    @Size(min = 1, max = 255, message = "INVALID_FIRSTNAME")
    String firstname;
    @Size(min = 1, max = 255, message = "INVALID_LASTNAME")
    String lastname;
    String address;
    @PhoneNumberConstraint
    String phoneNumber;
    @EnumConstraint(enumClass = Gender.class, message = "INVALID_GENDER")
    String gender;
    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate dob;
    @Email(message = "INVALID_EMAIL")
    String email;
    @Valid
    RoleAccountCreationRequest account;
}

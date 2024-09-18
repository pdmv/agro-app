package com.pdmv.agro.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(
        validatedBy = {PhoneNumberValidator.class}
)
public @interface PhoneNumberConstraint {
    String message() default "INVALID_PHONE_NUMBER";

    String regex() default "^(\\+\\d{1,3}[- ]?)?\\d{10,15}$";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

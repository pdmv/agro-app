package com.pdmv.agro.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class PhoneNumberValidator implements ConstraintValidator<PhoneNumberConstraint, String> {
    private Pattern pattern;

    @Override
    public void initialize(PhoneNumberConstraint constraintAnnotation) {
        pattern = Pattern.compile(constraintAnnotation.regex());
    }

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext constraintValidatorContext) {
        if (phoneNumber == null) {
            return true;
        }
        return pattern.matcher(phoneNumber).matches();
    }
}

package com.pdmv.agro.service;

import com.nimbusds.jose.JOSEException;
import com.pdmv.agro.dto.request.AuthenticationRequest;
import com.pdmv.agro.dto.request.IntrospectRequest;
import com.pdmv.agro.dto.response.AuthenticationResponse;
import com.pdmv.agro.dto.response.IntrospectResponse;
import com.pdmv.agro.exception.AppException;
import com.pdmv.agro.enums.ErrorCode;
import com.pdmv.agro.repository.AccountRepository;
import com.pdmv.agro.util.JwtUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    AccountRepository accountRepository;
    JwtUtil jwtUtil;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        var account = accountRepository.findAccountByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), account.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var token = jwtUtil.generateToken(account);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            jwtUtil.validateToken(token);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }
}

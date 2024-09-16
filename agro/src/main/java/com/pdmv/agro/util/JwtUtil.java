package com.pdmv.agro.util;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.pdmv.agro.pojo.Account;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JwtUtil {
    @NonFinal   // Đánh dấu để không inject vào constructor
    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;
    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;
    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    // Tạo token
    public String generateToken(Account account) {
        // Tạo header chứa thuật toán mã hoá
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        // Define claim set cho token
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("agro")
                .issueTime(new Date())  // Thời gian issue
                .expirationTime(new Date(
                        // Thời gian sống của token, thời gian hiện tại + thời gian sống -> millisecond
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())    // Id jwt (phục vụ thu hồi, ...)
                .claim("scope", "ROLE_" + account.getRole())
                .build();

        // Ký JWT
        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        try {
            signedJWT.sign(new MACSigner(SIGNER_KEY));
        } catch (JOSEException e) {
            log.error("Cannot create token.", e);
            throw new RuntimeException(e);
        }

        return signedJWT.serialize();
    }

    // Xác thực chữ ký
    private boolean verifyToken(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY);

        return signedJWT.verify(verifier);
    }

    // Validate token
    public boolean validateToken(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

        Date expirationDate = claimsSet.getExpirationTime();

        // Kiểm tra xác thực chữ ký và hạn
        return verifyToken(token) && expirationDate.before(new Date());
    }
}

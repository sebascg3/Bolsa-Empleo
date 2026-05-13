package BolsaEmpleo.security;

import java.time.Instant;

public record JwtTokenData(
        String subject,
        Integer userId,
        String nombre,
        String rol,
        Instant expiresAt
) {
}


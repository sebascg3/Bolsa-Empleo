package BolsaEmpleo.security;

import BolsaEmpleo.logic.Usuario;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class JwtService {

    private static final String HEADER_JSON = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";

    private final ObjectMapper objectMapper;
    private final byte[] secretBytes;
    private final Duration expiration;

    public JwtService(ObjectMapper objectMapper,
                      @Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-minutes:480}") long expirationMinutes) {
        this.objectMapper = objectMapper;
        this.secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.expiration = Duration.ofMinutes(expirationMinutes);
    }

    public String generarToken(Usuario usuario) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(expiration);

        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("sub", usuario.getCorreo());
        claims.put("uid", usuario.getId());
        claims.put("nombre", usuario.getNombre());
        claims.put("rol", usuario.getRol().name());
        claims.put("iat", issuedAt.getEpochSecond());
        claims.put("exp", expiresAt.getEpochSecond());

        return buildJwt(claims);
    }

    public Optional<JwtTokenData> validarToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return Optional.empty();
            }

            String signingInput = parts[0] + "." + parts[1];
            String expectedSignature = sign(signingInput);
            if (!MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8))) {
                return Optional.empty();
            }

            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            Map<String, Object> claims = objectMapper.readValue(payloadBytes, new TypeReference<>() {});
            long exp = ((Number) claims.getOrDefault("exp", 0)).longValue();
            if (Instant.now().getEpochSecond() >= exp) {
                return Optional.empty();
            }

            return Optional.of(new JwtTokenData(
                    String.valueOf(claims.get("sub")),
                    claims.get("uid") == null ? null : Integer.valueOf(String.valueOf(claims.get("uid"))),
                    claims.get("nombre") == null ? null : String.valueOf(claims.get("nombre")),
                    claims.get("rol") == null ? null : String.valueOf(claims.get("rol")),
                    Instant.ofEpochSecond(exp)
            ));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Instant expiracionDesdeAhora() {
        return Instant.now().plus(expiration);
    }

    private String buildJwt(Map<String, Object> claims) {
        try {
            String header = base64Url(HEADER_JSON.getBytes(StandardCharsets.UTF_8));
            String payload = base64Url(objectMapper.writeValueAsBytes(claims));
            String signingInput = header + "." + payload;
            String signature = sign(signingInput);
            return signingInput + "." + signature;
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo generar el JWT", e);
        }
    }

    private String sign(String signingInput) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secretBytes, "HmacSHA256"));
        byte[] signature = mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8));
        return base64Url(signature);
    }

    private String base64Url(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }
}


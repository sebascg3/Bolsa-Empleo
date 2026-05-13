package BolsaEmpleo.api.dto;

public record RegistrationResponse(
        String message,
        UserInfoResponse user
) {
}


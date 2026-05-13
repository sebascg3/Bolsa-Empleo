package BolsaEmpleo.api.dto;

public record UserInfoResponse(
        Integer id,
        String nombre,
        String correo,
        String rol
) {
}


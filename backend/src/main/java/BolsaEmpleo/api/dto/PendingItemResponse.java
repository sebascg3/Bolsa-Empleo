package BolsaEmpleo.api.dto;

public record PendingItemResponse(
        Integer id,
        String nombre,
        String correo,
        String detalle
) {
}


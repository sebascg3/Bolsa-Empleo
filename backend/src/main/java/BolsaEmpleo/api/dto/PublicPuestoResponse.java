package BolsaEmpleo.api.dto;

import java.time.LocalDate;

public record PublicPuestoResponse(
        Integer id,
        String empresa,
        String descripcion,
        Double salario,
        String tipo,
        Boolean activo,
        LocalDate fecha
) {
}


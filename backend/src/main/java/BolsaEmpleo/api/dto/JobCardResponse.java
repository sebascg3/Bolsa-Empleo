package BolsaEmpleo.api.dto;

import java.time.LocalDate;

public record JobCardResponse(
        Integer id,
        String empresa,
        String descripcion,
        Double salario,
        String tipo,
        Boolean activo,
        LocalDate fecha,
        Integer coincidencia,
        // ← agregar esto
        java.util.List<String> requisitos) {
}


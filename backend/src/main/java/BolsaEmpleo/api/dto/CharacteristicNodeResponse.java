package BolsaEmpleo.api.dto;

import java.util.List;

public record CharacteristicNodeResponse(
        Integer id,
        String nombre,
        Integer padreId,
        List<CharacteristicNodeResponse> hijos
) {
}


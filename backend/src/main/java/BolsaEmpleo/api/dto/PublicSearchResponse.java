package BolsaEmpleo.api.dto;

import java.util.List;

public record PublicSearchResponse(
        List<JobCardResponse> puestos,
        List<CharacteristicNodeResponse> arbolCaracteristicas,
        List<Integer> seleccionadas
) {
}


package BolsaEmpleo.api.dto;

import java.util.List;

public record CharacteristicDetailResponse(
        CharacteristicNodeResponse current,
        List<CharacteristicNodeResponse> children,
        List<CharacteristicNodeResponse> route
) {
}


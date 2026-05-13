package BolsaEmpleo.api.dto;

import java.util.List;
import java.util.Map;

public record SkillUpsertRequest(
        List<Integer> caracteristicasSeleccionadas,
        Map<Integer, Integer> niveles
) {
}


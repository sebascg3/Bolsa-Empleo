package BolsaEmpleo.api.dto;

import BolsaEmpleo.logic.TipoPublicacion;

import java.util.List;
import java.util.Map;

public record JobUpsertRequest(
        String descripcion,
        Double salario,
        TipoPublicacion tipo,
        Boolean activo,
        List<Integer> caracteristicasSeleccionadas,
        Map<Integer, Integer> niveles
) {
}


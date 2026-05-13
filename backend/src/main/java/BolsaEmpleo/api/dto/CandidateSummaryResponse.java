package BolsaEmpleo.api.dto;

import java.util.List;

public record CandidateSummaryResponse(
        Integer id,
        String nombre,
        String apellido,
        String correo,
        String identificacion,
        String nacionalidad,
        String telefono,
        String residencia,
        String cv,
        Integer requisitosCumplidos,
        Integer porcentaje,
        List<CandidateSkillResponse> habilidades
) {
}


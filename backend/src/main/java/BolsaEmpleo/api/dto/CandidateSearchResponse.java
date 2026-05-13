package BolsaEmpleo.api.dto;

import java.util.List;
import java.util.Map;

public record CandidateSearchResponse(
        JobCardResponse puesto,
        List<CandidateSummaryResponse> candidatos,
        Map<Integer, Integer> requisitosCumplidos,
        Map<Integer, Integer> porcentajes,
        int totalRequisitos
) {
}


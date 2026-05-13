package BolsaEmpleo.api.dto;

import java.util.List;

public record ReportResponse(
        Integer mes,
        Integer anio,
        int total,
        List<JobCardResponse> puestos
) {
}


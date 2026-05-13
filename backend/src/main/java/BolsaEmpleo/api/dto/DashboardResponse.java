package BolsaEmpleo.api.dto;

import java.util.List;

public record DashboardResponse(
        String role,
        UserInfoResponse user,
        List<JobCardResponse> recentJobs,
        List<JobCardResponse> myJobs,
        List<PendingItemResponse> pendingEmpresas,
        List<PendingItemResponse> pendingOferentes,
        List<SkillResponse> skills
) {
}


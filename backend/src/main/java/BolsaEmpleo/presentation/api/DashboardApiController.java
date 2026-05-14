package BolsaEmpleo.presentation.api;

import BolsaEmpleo.api.dto.DashboardResponse;
import BolsaEmpleo.api.dto.JobCardResponse;
import BolsaEmpleo.api.dto.PendingItemResponse;
import BolsaEmpleo.api.dto.SkillResponse;
import BolsaEmpleo.api.dto.UserInfoResponse;
import BolsaEmpleo.logic.Administrador;
import BolsaEmpleo.logic.CaracteristicaOferente;
import BolsaEmpleo.logic.Empresa;
import BolsaEmpleo.logic.Oferente;
import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.Service;
import BolsaEmpleo.logic.Usuario;
import BolsaEmpleo.security.UserDetailsImp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DashboardApiController {

    private final Service service;

    public DashboardApiController(Service service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public DashboardResponse dashboard(@AuthenticationPrincipal UserDetailsImp userDetails) {
        Usuario usuario = userDetails.getUsuario();
        String role = usuario.getRol().name();
        boolean incluirPrivados = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_OFERENTE"::equals);

        List<JobCardResponse> recentJobs = toJobCards(service.puestosVisiblesRecientes(incluirPrivados));
        List<JobCardResponse> myJobs = new ArrayList<>();
        List<PendingItemResponse> pendingEmpresas = new ArrayList<>();
        List<PendingItemResponse> pendingOferentes = new ArrayList<>();
        List<SkillResponse> skills = new ArrayList<>();

        switch (role) {
            case "ADMIN" -> {
                for (Empresa empresa : service.empresasNoAprobadas()) {
                    pendingEmpresas.add(new PendingItemResponse(
                            empresa.getId(),
                            empresa.getUsuario() != null ? empresa.getUsuario().getNombre() : null,
                            empresa.getUsuario() != null ? empresa.getUsuario().getCorreo() : null,
                            empresa.getDescripcion()
                    ));
                }

                for (Oferente oferente : service.oferentesNoAprobados()) {
                    pendingOferentes.add(new PendingItemResponse(
                            oferente.getId(),
                            oferente.getUsuario() != null ? oferente.getUsuario().getNombre() : null,
                            oferente.getUsuario() != null ? oferente.getUsuario().getCorreo() : null,
                            oferente.getIdentificacion()
                    ));
                }

                Administrador administrador = service.administradorFindById(usuario.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Administrador no encontrado"));
                return new DashboardResponse(
                        role,
                        toUserInfo(administrador.getUsuario()),
                        recentJobs,
                        myJobs,
                        pendingEmpresas,
                        pendingOferentes,
                        skills
                );
            }
            case "EMPRESA" -> {
                Empresa empresa = service.empresaFindByUsuarioId(usuario.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));
                myJobs = toJobCards(service.puestosFindByEmpresa(empresa));
                return new DashboardResponse(
                        role,
                        toUserInfo(empresa.getUsuario()),
                        recentJobs,
                        myJobs,
                        pendingEmpresas,
                        pendingOferentes,
                        skills
                );
            }
            case "OFERENTE" -> {
                Oferente oferente = service.oferenteFindByUsuarioCorreo(usuario.getCorreo())
                        .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado"));
                for (CaracteristicaOferente co : service.oferenteCaracteristicasPorOferente(oferente.getId())) {
                    skills.add(new SkillResponse(
                            co.getIdCaracteristica() != null ? co.getIdCaracteristica().getId() : null,
                            co.getIdCaracteristica() != null ? co.getIdCaracteristica().getNombre() : null,
                            co.getNivel()
                    ));
                }
                return new DashboardResponse(
                        role,
                        toUserInfo(oferente.getUsuario()),
                        recentJobs,
                        myJobs,
                        pendingEmpresas,
                        pendingOferentes,
                        skills
                );
            }
            default -> throw new IllegalArgumentException("Rol no soportado");
        }
    }

    private List<JobCardResponse> toJobCards(Iterable<Puesto> puestos) {
        List<JobCardResponse> resultado = new ArrayList<>();
        for (Puesto puesto : puestos) {
            resultado.add(ApiMapper.toJobCard(puesto, null,
                    service.puestoCaracteristicasFindByPuesto(puesto.getId())));
        }
        return resultado;
    }


    private UserInfoResponse toUserInfo(Usuario usuario) {
        return new UserInfoResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name()
        );
    }
}


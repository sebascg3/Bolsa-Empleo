package BolsaEmpleo.presentation.api;

import BolsaEmpleo.api.dto.CandidateSearchResponse;
import BolsaEmpleo.api.dto.CandidateSkillResponse;
import BolsaEmpleo.api.dto.CandidateSummaryResponse;
import BolsaEmpleo.api.dto.JobCardResponse;
import BolsaEmpleo.api.dto.JobUpsertRequest;
import BolsaEmpleo.logic.Caracteristica;
import BolsaEmpleo.logic.CaracteristicaOferente;
import BolsaEmpleo.logic.Empresa;
import BolsaEmpleo.logic.Oferente;
import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.PuestoCaracteristica;
import BolsaEmpleo.logic.ResultadoBusquedaCandidatos;
import BolsaEmpleo.logic.Service;
import BolsaEmpleo.logic.Usuario;
import BolsaEmpleo.security.UserDetailsImp;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/empresa")
public class CompanyApiController {

    private final Service service;

    public CompanyApiController(Service service) {
        this.service = service;
    }

    private Empresa currentCompany(UserDetailsImp userDetails) {
        Usuario usuario = userDetails.getUsuario();
        return service.empresaFindByUsuarioId(usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada para el usuario autenticado"));
    }

    @GetMapping("/puestos")
    @Transactional(readOnly = true)
    public List<JobCardResponse> myJobs(@AuthenticationPrincipal UserDetailsImp userDetails) {
        Empresa empresa = currentCompany(userDetails);
        List<JobCardResponse> result = new ArrayList<>();
        for (Puesto puesto : service.puestosFindByEmpresa(empresa)) {
            result.add(ApiMapper.toJobCard(puesto));
        }
        return result;
    }

    @PostMapping("/puestos")
    @Transactional
    public ResponseEntity<JobCardResponse> createJob(@AuthenticationPrincipal UserDetailsImp userDetails,
                                                     @RequestBody JobUpsertRequest request) {
        Empresa empresa = currentCompany(userDetails);

        Puesto puesto = new Puesto();
        puesto.setDescripcion(request.descripcion());
        puesto.setSalario(request.salario());
        puesto.setTipo(request.tipo());
        puesto.setIdEmpresa(empresa);
        puesto.setFecha(java.time.LocalDate.now());
        puesto.setActivo(Boolean.TRUE.equals(request.activo()));

        Puesto saved = service.puestoSave(puesto);

        if (request.caracteristicasSeleccionadas() != null) {
            for (Integer idCar : request.caracteristicasSeleccionadas()) {
                Caracteristica caracteristica = service.caracteristicaFindById(idCar)
                        .orElseThrow(() -> new IllegalArgumentException("Característica no encontrada"));
                Integer nivel = request.niveles() != null && request.niveles().get(idCar) != null
                        ? request.niveles().get(idCar)
                        : 1;

                PuestoCaracteristica pc = new PuestoCaracteristica();
                pc.setIdPuesto(saved);
                pc.setIdCaracteristica(caracteristica);
                pc.setNivel(nivel);
                service.puestoCaracteristicaSave(pc);
            }
        }

        return ResponseEntity.ok(ApiMapper.toJobCard(saved));
    }

    @PatchMapping("/puestos/{id}/toggle")
    @Transactional
    public ResponseEntity<JobCardResponse> toggleJob(@PathVariable Integer id,
                                                     @AuthenticationPrincipal UserDetailsImp userDetails) {
        Empresa empresa = currentCompany(userDetails);
        Puesto puesto = service.puestoFindById(id)
                .orElseThrow(() -> new IllegalArgumentException("Puesto no encontrado"));
        if (!puesto.getIdEmpresa().getId().equals(empresa.getId())) {
            throw new IllegalArgumentException("No puedes modificar un puesto de otra empresa.");
        }

        puesto.setActivo(!Boolean.TRUE.equals(puesto.getActivo()));
        Puesto updated = service.puestoUpdate(puesto);
        return ResponseEntity.ok(ApiMapper.toJobCard(updated));
    }

    @GetMapping("/puestos/{puestoId}/candidatos")
    @Transactional(readOnly = true)
    public CandidateSearchResponse candidates(@PathVariable Integer puestoId) {
        ResultadoBusquedaCandidatos resultado = service.buscarCandidatosPorPuesto(puestoId);
        List<CandidateSummaryResponse> candidatos = new ArrayList<>();

        for (Oferente oferente : resultado.getOferentes()) {
            List<CaracteristicaOferente> habilidades = service.oferenteCaracteristicasPorOferente(oferente.getId());
            List<CandidateSkillResponse> skillResponses = new ArrayList<>();
            for (CaracteristicaOferente co : habilidades) {
                skillResponses.add(ApiMapper.toCandidateSkill(co));
            }

            Integer cumplidos = resultado.getRequisitosCumplidos().getOrDefault(oferente.getId(), 0);
            Integer porcentaje = resultado.getPorcentajes().getOrDefault(oferente.getId(), 0);
            candidatos.add(ApiMapper.toCandidateSummary(oferente, cumplidos, porcentaje, skillResponses));
        }

        return new CandidateSearchResponse(
                ApiMapper.toJobCard(resultado.getPuesto()),
                candidatos,
                resultado.getRequisitosCumplidos(),
                resultado.getPorcentajes(),
                resultado.getTotalRequisitos()
        );
    }

    @GetMapping("/candidatos/{oferenteId}")
    @Transactional(readOnly = true)
    public ResponseEntity<CandidateSummaryResponse> candidateDetail(@PathVariable Integer oferenteId,
                                                                    @RequestParam(value = "puestoId", required = false) Integer puestoId) {
        BolsaEmpleo.logic.DetalleCandidatoDTO detalle = service.obtenerDetalleCandidato(oferenteId, puestoId);
        List<CandidateSkillResponse> habilidades = new ArrayList<>();
        for (CaracteristicaOferente co : detalle.getHabilidades()) {
            habilidades.add(ApiMapper.toCandidateSkill(co));
        }
        Oferente oferente = detalle.getOferente();
        return ResponseEntity.ok(ApiMapper.toCandidateSummary(oferente, habilidades.size(), 100, habilidades));
    }
}



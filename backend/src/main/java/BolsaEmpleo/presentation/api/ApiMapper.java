package BolsaEmpleo.presentation.api;

import BolsaEmpleo.api.dto.CandidateSkillResponse;
import BolsaEmpleo.api.dto.CandidateSummaryResponse;
import BolsaEmpleo.api.dto.CharacteristicNodeResponse;
import BolsaEmpleo.api.dto.JobCardResponse;
import BolsaEmpleo.api.dto.PendingItemResponse;
import BolsaEmpleo.api.dto.SkillResponse;
import BolsaEmpleo.api.dto.UserInfoResponse;
import BolsaEmpleo.logic.Caracteristica;
import BolsaEmpleo.logic.CaracteristicaOferente;
import BolsaEmpleo.logic.Empresa;
import BolsaEmpleo.logic.NodoCaracteristica;
import BolsaEmpleo.logic.Oferente;
import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.Usuario;

import java.util.ArrayList;
import java.util.List;

public final class ApiMapper {

    private ApiMapper() {
    }

    public static JobCardResponse toJobCard(Puesto puesto) {
        return toJobCard(puesto, null);
    }

    public static JobCardResponse toJobCard(Puesto puesto, Integer coincidencia) {
        String empresa = null;
        if (puesto.getIdEmpresa() != null && puesto.getIdEmpresa().getUsuario() != null) {
            empresa = puesto.getIdEmpresa().getUsuario().getNombre();
        }
        return new JobCardResponse(
                puesto.getId(),
                empresa,
                puesto.getDescripcion(),
                puesto.getSalario(),
                puesto.getTipo() != null ? puesto.getTipo().name() : null,
                puesto.getActivo(),
                puesto.getFecha(),
                coincidencia
        );
    }

    public static UserInfoResponse toUserInfo(Usuario usuario) {
        return new UserInfoResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name()
        );
    }

    public static PendingItemResponse toPendingEmpresa(Empresa empresa) {
        return new PendingItemResponse(
                empresa.getId(),
                empresa.getUsuario() != null ? empresa.getUsuario().getNombre() : null,
                empresa.getUsuario() != null ? empresa.getUsuario().getCorreo() : null,
                empresa.getDescripcion()
        );
    }

    public static PendingItemResponse toPendingOferente(Oferente oferente) {
        String nombreCompleto = oferente.getUsuario() != null ? oferente.getUsuario().getNombre() : null;
        if (oferente.getApellido() != null && !oferente.getApellido().isBlank()) {
            nombreCompleto = (nombreCompleto == null ? "" : nombreCompleto + " ") + oferente.getApellido();
        }
        return new PendingItemResponse(
                oferente.getId(),
                nombreCompleto,
                oferente.getUsuario() != null ? oferente.getUsuario().getCorreo() : null,
                oferente.getIdentificacion()
        );
    }

    public static SkillResponse toSkill(CaracteristicaOferente co) {
        return new SkillResponse(
                co.getIdCaracteristica() != null ? co.getIdCaracteristica().getId() : null,
                co.getIdCaracteristica() != null ? co.getIdCaracteristica().getNombre() : null,
                co.getNivel()
        );
    }

    public static CandidateSkillResponse toCandidateSkill(CaracteristicaOferente co) {
        return new CandidateSkillResponse(
                co.getIdCaracteristica() != null ? co.getIdCaracteristica().getId() : null,
                co.getIdCaracteristica() != null ? co.getIdCaracteristica().getNombre() : null,
                co.getNivel()
        );
    }

    public static CandidateSummaryResponse toCandidateSummary(Oferente oferente,
                                                              Integer requisitosCumplidos,
                                                              Integer porcentaje,
                                                              List<CandidateSkillResponse> habilidades) {
        return new CandidateSummaryResponse(
                oferente.getId(),
                oferente.getUsuario() != null ? oferente.getUsuario().getNombre() : null,
                oferente.getApellido(),
                oferente.getUsuario() != null ? oferente.getUsuario().getCorreo() : null,
                oferente.getIdentificacion(),
                oferente.getNacionalidad(),
                oferente.getTelefono(),
                oferente.getResidencia(),
                oferente.getCv(),
                requisitosCumplidos,
                porcentaje,
                habilidades
        );
    }

    public static CharacteristicNodeResponse toNode(NodoCaracteristica nodo) {
        Caracteristica c = nodo.getCaracteristica();
        List<CharacteristicNodeResponse> hijos = new ArrayList<>();
        for (NodoCaracteristica hijo : nodo.getHijos()) {
            hijos.add(toNode(hijo));
        }
        return new CharacteristicNodeResponse(
                c.getId(),
                c.getNombre(),
                c.getIdPadre() != null ? c.getIdPadre().getId() : null,
                hijos
        );
    }

    public static CharacteristicNodeResponse toNode(Caracteristica c) {
        return new CharacteristicNodeResponse(
                c.getId(),
                c.getNombre(),
                c.getIdPadre() != null ? c.getIdPadre().getId() : null,
                List.of()
        );
    }

    public static List<CharacteristicNodeResponse> toNodes(List<NodoCaracteristica> nodes) {
        List<CharacteristicNodeResponse> result = new ArrayList<>();
        for (NodoCaracteristica node : nodes) {
            result.add(toNode(node));
        }
        return result;
    }

    public static List<CharacteristicNodeResponse> toNodesFromCaracteristicas(List<Caracteristica> caracteristicas) {
        List<CharacteristicNodeResponse> result = new ArrayList<>();
        for (Caracteristica c : caracteristicas) {
            result.add(toNode(c));
        }
        return result;
    }
}


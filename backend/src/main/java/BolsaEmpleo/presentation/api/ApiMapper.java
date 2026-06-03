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
        return toJobCard(puesto, null, java.util.Collections.emptyList());
    }

    public static JobCardResponse toJobCard(Puesto puesto, Integer coincidencia) {
        return toJobCard(puesto, coincidencia, java.util.Collections.emptyList());
    }

    public static JobCardResponse toJobCard(Puesto puesto, Integer coincidencia,
                                            List<BolsaEmpleo.logic.PuestoCaracteristica> caracteristicas) {
        String empresa = null;
        if (puesto.getIdEmpresa() != null && puesto.getIdEmpresa().getUsuario() != null) {
            empresa = puesto.getIdEmpresa().getUsuario().getNombre();
        }
        List<String> requisitos = new java.util.ArrayList<>();
        if (caracteristicas != null) {
            for (BolsaEmpleo.logic.PuestoCaracteristica pc : caracteristicas) {
                if (pc.getIdCaracteristica() != null) {
                    requisitos.add(pc.getIdCaracteristica().getNombre() + " (nivel " + pc.getNivel() + ")");
                }
            }
        }
        return new JobCardResponse(
                puesto.getId(),
                empresa,
                puesto.getDescripcion(),
                puesto.getSalario(),
                puesto.getTipo() != null ? puesto.getTipo().name() : null,
                puesto.getActivo(),
                puesto.getFecha(),
                coincidencia,
                requisitos
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
                oferente.getUsuario() != null ? oferente.getUsuario().getNombre() : null
              ,
                oferente.getUsuario() != null ? oferente.getUsuario().getCorreo() : null,
                oferente.getIdentificacion(),
                oferente.getNacionalidad(),
                oferente.getTelefono(),
                oferente.getResidencia(),
                oferente.getCv(),
                requisitosCumplidos,
                porcentaje, oferente.getFotoPerfil(),
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


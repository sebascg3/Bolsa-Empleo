package BolsaEmpleo.presentation.api;

import BolsaEmpleo.api.dto.*;
import BolsaEmpleo.logic.NodoCaracteristica;
import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.Service;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    private final Service service;

    public PublicApiController(Service service) {
        this.service = service;
    }

    @GetMapping("/puestos-recientes")
    @Transactional(readOnly = true)
    public List<JobCardResponse> puestosRecientes(Authentication authentication) {
        boolean incluirPrivados = authentication != null
                && authentication.isAuthenticated()
                && authentication.getAuthorities().stream().anyMatch(a -> "ROLE_OFERENTE".equals(a.getAuthority()));
        List<JobCardResponse> resultado = new ArrayList<>();
        for (Puesto puesto : service.puestosVisiblesRecientes(incluirPrivados)) {
            resultado.add(ApiMapper.toJobCard(puesto, null,
                    service.puestoCaracteristicasFindByPuesto(puesto.getId())));
        }
        return resultado;
    }

    @GetMapping("/caracteristicas-arbol")
    @Transactional(readOnly = true)
    public List<CharacteristicNodeResponse> caracteristicasArbol() {
        List<CharacteristicNodeResponse> result = new ArrayList<>();
        for (NodoCaracteristica nodo : service.caracteristicasEnArbol()) {
            result.add(ApiMapper.toNode(nodo));
        }
        return result;
    }

    @GetMapping("/buscar")
    @Transactional(readOnly = true)
    public PublicSearchResponse buscar(Authentication authentication,
                                       @RequestParam(name = "caracteristicas", required = false) List<Integer> caracteristicas) {
        boolean incluirPrivados = authentication != null
                && authentication.isAuthenticated()
                && authentication.getAuthorities().stream().anyMatch(a -> "ROLE_OFERENTE".equals(a.getAuthority()));
        List<Integer> seleccionadas = caracteristicas == null ? new ArrayList<>() : new ArrayList<>(caracteristicas);
        List<JobCardResponse> puestos = new ArrayList<>();
        for (Puesto puesto : service.buscarPuestosPorCaracteristicas(seleccionadas, incluirPrivados)) {
            puestos.add(ApiMapper.toJobCard(puesto,
                    null,
                    service.puestoCaracteristicasFindByPuesto(puesto.getId())));
        }
        return new PublicSearchResponse(puestos, caracteristicasArbol(), seleccionadas);
    }
}
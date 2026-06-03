package BolsaEmpleo.presentation.api;

import BolsaEmpleo.api.dto.CharacteristicDetailResponse;
import BolsaEmpleo.api.dto.CharacteristicNodeResponse;
import BolsaEmpleo.api.dto.JobCardResponse;
import BolsaEmpleo.api.dto.PendingItemResponse;
import BolsaEmpleo.api.dto.ReportResponse;
import BolsaEmpleo.api.dto.UserInfoResponse;
import BolsaEmpleo.logic.Administrador;
import BolsaEmpleo.logic.Caracteristica;
import BolsaEmpleo.logic.Empresa;
import BolsaEmpleo.logic.NodoCaracteristica;
import BolsaEmpleo.logic.Oferente;
import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.Service;
import BolsaEmpleo.logic.Usuario;
import BolsaEmpleo.security.UserDetailsImp;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

	private final Service service;

	public AdminApiController(Service service) {
		this.service = service;
	}

	private Administrador currentAdmin(UserDetailsImp userDetails) {
		Usuario usuario = userDetails.getUsuario();
		return service.administradorFindById(usuario.getId())
				.orElseThrow(() -> new IllegalArgumentException("Administrador no encontrado"));
	}

	@GetMapping("/caracteristicas")
	@Transactional(readOnly = true)
	public List<CharacteristicNodeResponse> tree(@AuthenticationPrincipal UserDetailsImp userDetails) {
		currentAdmin(userDetails);
		List<CharacteristicNodeResponse> result = new ArrayList<>();
		for (NodoCaracteristica nodo : service.caracteristicasEnArbol()) {
			result.add(ApiMapper.toNode(nodo));
		}
		return result;
	}

	@GetMapping("/caracteristicas/{id}")
	@Transactional(readOnly = true)
	public CharacteristicDetailResponse detail(@AuthenticationPrincipal UserDetailsImp userDetails,
											   @PathVariable Integer id) {
		currentAdmin(userDetails);
		Caracteristica actual = service.caracteristicaFindById(id)
				.orElseThrow(() -> new IllegalArgumentException("Característica no encontrada"));
		List<CharacteristicNodeResponse> children = new ArrayList<>();
		for (Caracteristica child : service.caracteristicasHijas(id)) {
			children.add(ApiMapper.toNode(child));
		}
		List<CharacteristicNodeResponse> route = new ArrayList<>();
		for (Caracteristica c : service.rutaCaracteristica(id)) {
			route.add(ApiMapper.toNode(c));
		}
		return new CharacteristicDetailResponse(ApiMapper.toNode(actual), children, route);
	}

	@PostMapping("/caracteristicas")
	@Transactional
	public ResponseEntity<CharacteristicNodeResponse> createCharacteristic(@AuthenticationPrincipal UserDetailsImp userDetails,
																		   @RequestParam("nombre") String nombre,
																		   @RequestParam(value = "padreId", required = false) Integer padreId) {
		currentAdmin(userDetails);
		Caracteristica c = new Caracteristica();
		c.setNombre(nombre);
		if (padreId != null) {
			c.setIdPadre(service.caracteristicaFindById(padreId)
					.orElseThrow(() -> new IllegalArgumentException("Característica padre no encontrada")));
		}
		return ResponseEntity.ok(ApiMapper.toNode(service.caracteristicaSave(c)));
	}

	@GetMapping("/empresas-pendientes")
	@Transactional(readOnly = true)
	public List<PendingItemResponse> pendingCompanies(@AuthenticationPrincipal UserDetailsImp userDetails) {
		currentAdmin(userDetails);
		List<PendingItemResponse> result = new ArrayList<>();
		for (Empresa empresa : service.empresasNoAprobadas()) {
			result.add(ApiMapper.toPendingEmpresa(empresa));
		}
		return result;
	}

	@PostMapping("/empresas/{id}/aprobar")
	@Transactional
	public ResponseEntity<Void> approveCompany(@AuthenticationPrincipal UserDetailsImp userDetails,
											   @PathVariable Integer id) {
		currentAdmin(userDetails);
		service.aprobarEmpresa(id);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/oferentes-pendientes")
	@Transactional(readOnly = true)
	public List<PendingItemResponse> pendingApplicants(@AuthenticationPrincipal UserDetailsImp userDetails) {
		currentAdmin(userDetails);
		List<PendingItemResponse> result = new ArrayList<>();
		for (Oferente oferente : service.oferentesNoAprobados()) {
			result.add(ApiMapper.toPendingOferente(oferente));
		}
		return result;
	}

	@PostMapping("/oferentes/{id}/aprobar")
	@Transactional
	public ResponseEntity<Void> approveApplicant(@AuthenticationPrincipal UserDetailsImp userDetails,
												 @PathVariable Integer id) {
		currentAdmin(userDetails);
		service.aprobarOferente(id);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/reportes/puestos")
	@Transactional(readOnly = true)
	public ReportResponse jobsReport(@AuthenticationPrincipal UserDetailsImp userDetails,
									 @RequestParam("mes") Integer mes,
									 @RequestParam("anio") Integer anio) {
		currentAdmin(userDetails);

		List<JobCardResponse> puestos = new ArrayList<>();

		for (Puesto p : service.puestosPorMesYAnio(mes, anio)) {
			puestos.add(ApiMapper.toJobCard(
					p,
					null,
					service.puestoCaracteristicasFindByPuesto(p.getId())
			));
		}

		return new ReportResponse(mes, anio, puestos.size(), puestos);
	}

	@GetMapping("/dashboard")
	@Transactional(readOnly = true)
	public UserInfoResponse dashboard(@AuthenticationPrincipal UserDetailsImp userDetails) {
		Administrador admin = currentAdmin(userDetails);
		return ApiMapper.toUserInfo(admin.getUsuario());
	}

}

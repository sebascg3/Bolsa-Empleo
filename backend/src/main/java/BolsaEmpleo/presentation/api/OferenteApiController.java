package BolsaEmpleo.presentation.api;
import java.util.Map;
import BolsaEmpleo.api.dto.SkillResponse;
import BolsaEmpleo.api.dto.SkillUpsertRequest;
import BolsaEmpleo.logic.CaracteristicaOferente;
import BolsaEmpleo.logic.Oferente;
import BolsaEmpleo.logic.Service;
import BolsaEmpleo.security.UserDetailsImp;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/oferente")
public class OferenteApiController {

	private final Service service;

	public OferenteApiController(Service service) {
		this.service = service;
	}

	private Oferente currentOferente(UserDetailsImp userDetails) {
		return service.oferenteFindByUsuarioCorreo(userDetails.getUsername())
				.orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado"));
	}

	@GetMapping("/habilidades")
	@Transactional(readOnly = true)
	public List<SkillResponse> getSkills(@AuthenticationPrincipal UserDetailsImp userDetails) {
		Oferente oferente = currentOferente(userDetails);
		List<SkillResponse> result = new ArrayList<>();
		for (CaracteristicaOferente co : service.oferenteCaracteristicasPorOferente(oferente.getId())) {
			result.add(ApiMapper.toSkill(co));
		}
		return result;
	}

	@PutMapping("/habilidades")
	@Transactional
	public ResponseEntity<List<SkillResponse>> replaceSkills(@AuthenticationPrincipal UserDetailsImp userDetails,
															 @RequestBody SkillUpsertRequest request) {
		Oferente oferente = currentOferente(userDetails);

		service.reemplazarCaracteristicasOferente(oferente, request.caracteristicasSeleccionadas(), request.niveles());

		return ResponseEntity.ok(getSkills(userDetails));
	}

	@DeleteMapping("/habilidades/{id}")
	@Transactional
	public ResponseEntity<Void> deleteSkill(@AuthenticationPrincipal UserDetailsImp userDetails,
											@PathVariable Integer id) {
		Oferente oferente = currentOferente(userDetails);
		CaracteristicaOferente co = service.oferenteCaracteristicaFindById(id)
				.orElseThrow(() -> new IllegalArgumentException("Habilidad no encontrada"));
		if (!co.getIdOferente().getId().equals(oferente.getId())) {
			throw new IllegalArgumentException("No puedes eliminar habilidades de otro usuario.");
		}
		service.oferenteCaracteristicaDelete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/cv")
	@Transactional(readOnly = true)
	public ResponseEntity<String> getCv(@AuthenticationPrincipal UserDetailsImp userDetails) {
		Oferente oferente = currentOferente(userDetails);
		return ResponseEntity.ok(oferente.getCv() == null ? "" : oferente.getCv());
	}

	@PostMapping("/cv")
	@Transactional
	public ResponseEntity<String> uploadCv(@AuthenticationPrincipal UserDetailsImp userDetails,
										   @RequestParam("cv") MultipartFile cv) throws Exception {
		if (cv == null || cv.isEmpty()) {
			throw new IllegalArgumentException("Debes seleccionar un archivo PDF.");
		}
		String original = cv.getOriginalFilename();
		if (original == null || !original.toLowerCase().endsWith(".pdf")) {
			throw new IllegalArgumentException("El archivo debe ser un PDF.");
		}

		Oferente oferente = currentOferente(userDetails);
		String nombreArchivo = oferente.getId() + ".pdf";
		Path carpeta = Paths.get(System.getProperty("user.dir"), "uploads");
		Files.createDirectories(carpeta);
		cv.transferTo(carpeta.resolve(nombreArchivo).toFile());
		oferente.setCv(nombreArchivo);
		service.oferenteUpdate(oferente);
		return ResponseEntity.ok(nombreArchivo);
	}
	@GetMapping("/cv/archivo")
	@Transactional(readOnly = true)
	public ResponseEntity<Resource> getCvFile(@AuthenticationPrincipal UserDetailsImp userDetails) throws Exception {
		Oferente oferente = currentOferente(userDetails);

		if (oferente.getCv() == null || oferente.getCv().isBlank()) {
			throw new IllegalArgumentException("No hay CV cargado.");
		}

		Path archivo = Paths.get(System.getProperty("user.dir"), "uploads", oferente.getCv());

		if (!Files.exists(archivo)) {
			throw new IllegalArgumentException("El archivo del CV no existe.");
		}

		Resource resource = new UrlResource(archivo.toUri());

		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_PDF)
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + oferente.getCv() + "\"")
				.body(resource);
	}
	@DeleteMapping("/cv")
	@Transactional
	public ResponseEntity<Void> deleteCv(@AuthenticationPrincipal UserDetailsImp userDetails) {
		Oferente oferente = currentOferente(userDetails);
		oferente.setCv(null);
		service.oferenteUpdate(oferente);
		return ResponseEntity.noContent().build();
	}


	@GetMapping("/foto")
	@Transactional(readOnly = true)
	public ResponseEntity<Map<String, String>> getFoto(@AuthenticationPrincipal UserDetailsImp userDetails) {
		Oferente oferente = currentOferente(userDetails);

		return ResponseEntity.ok(
				Map.of("fotoPerfil", oferente.getFotoPerfil() == null ? "" : oferente.getFotoPerfil())
		);
	}

	@PostMapping("/foto")
	@Transactional
	public ResponseEntity<Map<String, String>> uploadFoto(
			@AuthenticationPrincipal UserDetailsImp userDetails,
			@RequestParam("foto") MultipartFile foto
	) throws Exception {
		if (foto == null || foto.isEmpty()) {
			throw new IllegalArgumentException("Debes seleccionar una imagen.");
		}

		String original = foto.getOriginalFilename();
		if (original == null) {
			throw new IllegalArgumentException("Archivo inválido.");
		}

		String lower = original.toLowerCase();

		if (!lower.endsWith(".jpg") && !lower.endsWith(".jpeg") && !lower.endsWith(".png")) {
			throw new IllegalArgumentException("La foto debe ser JPG, JPEG o PNG.");
		}

		Oferente oferente = currentOferente(userDetails);

		String extension = lower.substring(lower.lastIndexOf("."));
		String nombreArchivo = oferente.getId() + extension;

		Path carpeta = Paths.get(System.getProperty("user.dir"), "uploads", "fotos");
		Files.createDirectories(carpeta);

		foto.transferTo(carpeta.resolve(nombreArchivo).toFile());

		oferente.setFotoPerfil(nombreArchivo);
		service.oferenteUpdate(oferente);

		return ResponseEntity.ok(Map.of("fotoPerfil", nombreArchivo));
	}

	@GetMapping("/foto/archivo")
	@Transactional(readOnly = true)
	public ResponseEntity<Resource> getFotoFile(@AuthenticationPrincipal UserDetailsImp userDetails) throws Exception {
		Oferente oferente = currentOferente(userDetails);

		if (oferente.getFotoPerfil() == null || oferente.getFotoPerfil().isBlank()) {
			throw new IllegalArgumentException("No hay foto cargada.");
		}

		Path archivo = Paths.get(System.getProperty("user.dir"), "uploads", "fotos", oferente.getFotoPerfil());

		if (!Files.exists(archivo)) {
			throw new IllegalArgumentException("El archivo de la foto no existe.");
		}

		Resource resource = new UrlResource(archivo.toUri());

		String lower = oferente.getFotoPerfil().toLowerCase();
		MediaType mediaType = lower.endsWith(".png")
				? MediaType.IMAGE_PNG
				: MediaType.IMAGE_JPEG;

		return ResponseEntity.ok()
				.contentType(mediaType)
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + oferente.getFotoPerfil() + "\"")
				.body(resource);
	}

	@DeleteMapping("/foto")
	@Transactional
	public ResponseEntity<Void> deleteFoto(@AuthenticationPrincipal UserDetailsImp userDetails) {
		Oferente oferente = currentOferente(userDetails);
		oferente.setFotoPerfil(null);
		service.oferenteUpdate(oferente);
		return ResponseEntity.noContent().build();
	}

}

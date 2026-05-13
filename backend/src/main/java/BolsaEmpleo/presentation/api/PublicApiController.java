package BolsaEmpleo.presentation.api;

import BolsaEmpleo.api.dto.*;
import BolsaEmpleo.logic.NodoCaracteristica;
import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.Service;
import BolsaEmpleo.logic.Usuario;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
            resultado.add(ApiMapper.toJobCard(puesto));
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
            puestos.add(ApiMapper.toJobCard(puesto, service.porcentajeCoincidenciaPuesto(puesto, seleccionadas)));
        }
        return new PublicSearchResponse(puestos, caracteristicasArbol(), seleccionadas);
    }

    @PostMapping("/register/oferente")
    @Transactional
    public ResponseEntity<RegistrationResponse> registerOferente(@RequestParam("nombre") String nombre,
                                                                @RequestParam(value = "apellido", required = false) String apellido,
                                                                @RequestParam("correo") String correo,
                                                                @RequestParam("password") String password,
                                                                @RequestParam("identificacion") String identificacion,
                                                                @RequestParam(value = "nacionalidad", required = false) String nacionalidad,
                                                                @RequestParam(value = "telefono", required = false) String telefono,
                                                                @RequestParam(value = "residencia", required = false) String residencia,
                                                                @RequestParam("cv") MultipartFile cv) throws Exception {
        if (cv == null || cv.isEmpty()) {
            throw new IllegalArgumentException("Debe seleccionar un archivo PDF.");
        }
        String original = cv.getOriginalFilename();
        if (original == null || !original.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("El archivo debe ser un PDF.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setCorreo(correo);
        usuario.setPassword(password);

        BolsaEmpleo.logic.Oferente oferente = new BolsaEmpleo.logic.Oferente();
        oferente.setIdentificacion(identificacion);
        oferente.setApellido(apellido);
        oferente.setNacionalidad(nacionalidad);
        oferente.setTelefono(telefono);
        oferente.setResidencia(residencia);

        service.registrarOferente(usuario, oferente);

        String nombreArchivo = oferente.getId() + ".pdf";
        Path carpetaUploads = Paths.get(System.getProperty("user.dir"), "uploads");
        Files.createDirectories(carpetaUploads);
        cv.transferTo(carpetaUploads.resolve(nombreArchivo).toFile());
        oferente.setCv(nombreArchivo);
        service.oferenteUpdate(oferente);

        return ResponseEntity.ok(new RegistrationResponse(
                "Oferente registrado correctamente.",
                ApiMapper.toUserInfo(usuario)
        ));
    }

    @PostMapping("/register/empresa")
    @Transactional
    public ResponseEntity<RegistrationResponse> registerEmpresa(@RequestParam("nombre") String nombre,
                                                                @RequestParam("correo") String correo,
                                                                @RequestParam("password") String password,
                                                                @RequestParam(value = "ubicacion", required = false) String ubicacion,
                                                                @RequestParam(value = "telefono", required = false) String telefono,
                                                                @RequestParam(value = "descripcion", required = false) String descripcion) {
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setCorreo(correo);
        usuario.setPassword(password);

        BolsaEmpleo.logic.Empresa empresa = new BolsaEmpleo.logic.Empresa();
        empresa.setUbicacion(ubicacion);
        empresa.setTelefono(telefono);
        empresa.setDescripcion(descripcion);

        service.registrarEmpresa(usuario, empresa);

        return ResponseEntity.ok(new RegistrationResponse(
                "Empresa registrada correctamente.",
                ApiMapper.toUserInfo(usuario)
        ));
    }
}


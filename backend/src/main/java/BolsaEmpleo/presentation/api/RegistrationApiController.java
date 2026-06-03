package BolsaEmpleo.presentation.api;

import BolsaEmpleo.api.dto.RegistrationResponse;
import BolsaEmpleo.api.dto.UserInfoResponse;
import BolsaEmpleo.logic.Empresa;
import BolsaEmpleo.logic.Oferente;
import BolsaEmpleo.logic.Rol;
import BolsaEmpleo.logic.Usuario;
import BolsaEmpleo.logic.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/public")
public class RegistrationApiController {

    private final Service service;

    public RegistrationApiController(Service service) {
        this.service = service;
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
        usuario.setRol(Rol.OFERENTE);
        usuario.setActivo(true);

        Oferente oferente = new Oferente();
        oferente.setIdentificacion(identificacion);

        oferente.setNacionalidad(nacionalidad);
        oferente.setTelefono(telefono);
        oferente.setResidencia(residencia);
        oferente.setAprobado(false);

        service.registrarOferente(usuario, oferente);

        String nombreArchivo = oferente.getId() + ".pdf";
        Path carpetaUploads = Paths.get(System.getProperty("user.dir"), "uploads");
        Files.createDirectories(carpetaUploads);
        cv.transferTo(carpetaUploads.resolve(nombreArchivo).toFile());

        oferente.setCv(nombreArchivo);
        service.oferenteUpdate(oferente);

        return ResponseEntity.ok(new RegistrationResponse(
                "Oferente registrado correctamente.",
                new UserInfoResponse(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol().name())
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

        Empresa empresa = new Empresa();
        empresa.setUbicacion(ubicacion);
        empresa.setTelefono(telefono);
        empresa.setDescripcion(descripcion);

        service.registrarEmpresa(usuario, empresa);

        return ResponseEntity.ok(new RegistrationResponse(
                "Empresa registrada correctamente.",
                new UserInfoResponse(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), Rol.EMPRESA.name())
        ));
    }
}


package BolsaEmpleo.presentation.publico;

import BolsaEmpleo.logic.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Controller("partepublica")
@RequestMapping("/")
public class Controller {

    @Autowired
    private Service service;

    // Pag principal

    @GetMapping({"", "/"})
    public String home(Model model) {
        model.addAttribute("puestosRecientes", service.puestosPublicosRecientes());
        return "presentation/partepublica/Principal";
    }





    @GetMapping("/registro/oferente")
    public String showRegistroOferente(Model model) {
        model.addAttribute("usuario", new Usuario());
        model.addAttribute("oferente", new Oferente());
        return "presentation/partepublica/RegistroOferentes";
    }

    @PostMapping("/registro/oferente")
    public String createOferente(Model model,
                                 @RequestParam("nombre") String nombre,
                                 @RequestParam("correo") String correo,
                                 @RequestParam("password") String password,
                                 @RequestParam("identificacion") String identificacion,
                                 @RequestParam(value = "nacionalidad", required = false) String nacionalidad,
                                 @RequestParam(value = "telefono", required = false) String telefono,
                                 @RequestParam(value = "residencia", required = false) String residencia,
                                 @RequestParam("cv") MultipartFile cv) {

        try {
            if (cv.isEmpty()) {
                throw new Exception("Debe seleccionar un archivo PDF.");
            }

            String original = cv.getOriginalFilename();
            if (original == null || !original.toLowerCase().endsWith(".pdf")) {
                throw new Exception("El archivo debe ser un PDF.");
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

            Path rutaArchivo = carpetaUploads.resolve(nombreArchivo);
            cv.transferTo(rutaArchivo.toFile());

            oferente.setCv(nombreArchivo);
            service.oferenteUpdate(oferente);

            return "redirect:/login";

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", e.getMessage());
            model.addAttribute("usuario", new Usuario());
            model.addAttribute("oferente", new Oferente());
            return "presentation/partepublica/RegistroOferentes";
        }
    }

    //Registrar empresa

    @GetMapping("/registro/empresa")
    public String showRegistroEmpresa(Model model) {
        model.addAttribute("usuario", new Usuario());
        model.addAttribute("empresa", new Empresa());
        return "presentation/partepublica/RegistroEmpresas";
    }

    @PostMapping("/registro/empresa")
    public String createEmpresa(Model model,
                                @RequestParam("nombre") String nombre,
                                @RequestParam("correo") String correo,
                                @RequestParam("password") String password,
                                @RequestParam(value = "ubicacion", required = false) String ubicacion,
                                @RequestParam(value = "telefono", required = false) String telefono,
                                @RequestParam(value = "descripcion", required = false) String descripcion) {

        try {
            Usuario usuario = new Usuario();
            usuario.setNombre(nombre);
            usuario.setCorreo(correo);
            usuario.setPassword(password);

            Empresa empresa = new Empresa();
            empresa.setUbicacion(ubicacion);
            empresa.setTelefono(telefono);
            empresa.setDescripcion(descripcion);

            service.registrarEmpresa(usuario, empresa);
            return "redirect:/login";

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", e.getMessage());

            model.addAttribute("usuario", new Usuario());
            model.addAttribute("empresa", new Empresa());

            return "presentation/partepublica/RegistroEmpresas";
        }
    }

    @GetMapping("/puestos/buscar")
    public String buscarPuestos(Model model) {
        model.addAttribute("puestos", new ArrayList<Puesto>());
        model.addAttribute("arbolCaracteristicas", service.caracteristicasEnArbol());
        model.addAttribute("seleccionadas", new ArrayList<Integer>());
        return "presentation/partepublica/BuscarPuestos";
    }
    @PostMapping("/puestos/buscar")
    public String filtrarPuestos(
            @RequestParam(name = "caracteristicas", required = false) List<Integer> caracteristicasSeleccionadas,
            Model model) {

        List<Puesto> puestos;

        if (caracteristicasSeleccionadas == null || caracteristicasSeleccionadas.isEmpty()) {
            puestos = service.puestosFindAll();
            caracteristicasSeleccionadas = new ArrayList<>();
        } else {
            puestos = service.buscarPuestosPorCaracteristicas(caracteristicasSeleccionadas);
        }

        model.addAttribute("puestos", puestos);
        model.addAttribute("arbolCaracteristicas", service.caracteristicasEnArbol());
        model.addAttribute("seleccionadas", caracteristicasSeleccionadas);

        return "presentation/partepublica/BuscarPuestos";
    }


}
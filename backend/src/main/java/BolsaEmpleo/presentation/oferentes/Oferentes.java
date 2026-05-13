package BolsaEmpleo.presentation.oferentes;

import BolsaEmpleo.logic.Caracteristica;
import BolsaEmpleo.logic.CaracteristicaOferente;
import BolsaEmpleo.logic.Oferente;
import BolsaEmpleo.logic.Service;
import BolsaEmpleo.security.UserDetailsImp;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
import java.util.stream.Collectors;

@Controller("oferentes")
@RequestMapping("/presentation/oferentes")
public class Oferentes {

    @Autowired
    private Service service;


    private Oferente obtenerOferenteActual(UserDetailsImp userDetails) {
        String correo = userDetails.getUsername();
        return service.oferenteFindByUsuarioCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado para el usuario autenticado"));
    }

    private void prepararModeloHabilidades(Model model, Oferente oferente) {
        List<CaracteristicaOferente> habilidades = service.oferenteCaracteristicasPorOferente(oferente.getId());

        Set<Integer> seleccionadas = habilidades.stream()
                .map(co -> co.getIdCaracteristica().getId())
                .collect(Collectors.toSet());

        Map<Integer, Integer> niveles = habilidades.stream()
                .collect(Collectors.toMap(
                        co -> co.getIdCaracteristica().getId(),
                        co -> co.getNivel() == null ? 1 : co.getNivel()
                ));

        model.addAttribute("arbolCaracteristicas", service.caracteristicasEnArbol());
        model.addAttribute("seleccionadas", seleccionadas);
        model.addAttribute("niveles", niveles);
        model.addAttribute("habilidades", habilidades);
    }

    private void prepararDatosSesion(Model model, UserDetailsImp userDetails) {
        model.addAttribute("correo", userDetails.getUsername());
        model.addAttribute("nombre", userDetails.getUsuario() != null ? userDetails.getUsuario().getNombre() : null);
    }


    @GetMapping("/show")
    public String showDashboard(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Oferente oferente = obtenerOferenteActual(userDetails);
        model.addAttribute("oferente", oferente);

        prepararDatosSesion(model, userDetails);
        return "presentation/oferente/Dashboard";
    }


    @GetMapping("/habilidades")
    public String verHabilidades(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Oferente oferente = obtenerOferenteActual(userDetails);
        model.addAttribute("oferente", oferente);
        prepararDatosSesion(model, userDetails);
        prepararModeloHabilidades(model, oferente);
        return "presentation/oferente/MisHabilidades";
    }

    @PostMapping("/habilidades")
    public String guardarHabilidades(@AuthenticationPrincipal UserDetailsImp userDetails,
                                     @RequestParam(name = "caracteristicasSeleccionadas", required = false) List<Integer> seleccionadas,
                                     HttpServletRequest request,
                                     RedirectAttributes redirectAttributes) {
        try {
            Oferente oferente = obtenerOferenteActual(userDetails);

            service.oferenteCaracteristicasPorOferente(oferente.getId())
                    .forEach(co -> service.oferenteCaracteristicaDelete(co.getId()));

            if (seleccionadas != null) {
                for (Integer idCar : seleccionadas) {
                    Caracteristica caracteristica = service.caracteristicaFindById(idCar)
                            .orElseThrow(() -> new IllegalArgumentException("Característica no encontrada"));

                    String nivelStr = request.getParameter("nivel_" + idCar);
                    Integer nivel = (nivelStr == null || nivelStr.isBlank()) ? 1 : Integer.parseInt(nivelStr);

                    CaracteristicaOferente co = new CaracteristicaOferente();
                    co.setIdOferente(oferente);
                    co.setIdCaracteristica(caracteristica);
                    co.setNivel(nivel);

                    service.oferenteCaracteristicaSave(co);
                }
            }

            redirectAttributes.addFlashAttribute("exito", "Habilidades guardadas correctamente.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }

        return "redirect:/presentation/oferentes/habilidades";
    }

    @GetMapping("/habilidades/eliminar/{id}")
    public String eliminarHabilidad(@AuthenticationPrincipal UserDetailsImp userDetails,
                                    @PathVariable Integer id,
                                    RedirectAttributes redirectAttributes) {
        try {
            Oferente oferente = obtenerOferenteActual(userDetails);

            CaracteristicaOferente co = service.oferenteCaracteristicaFindById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Habilidad no encontrada"));

            if (!Objects.equals(co.getIdOferente().getId(), oferente.getId())) {
                throw new IllegalArgumentException("No puedes eliminar habilidades de otro usuario.");
            }

            service.oferenteCaracteristicaDelete(id);
            redirectAttributes.addFlashAttribute("exito", "Habilidad eliminada.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }

        return "redirect:/presentation/oferentes/habilidades";
    }

    @GetMapping("/habilidades/editar/{id}")
    public String editarHabilidad(@PathVariable Integer id,
                                  RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("editId", id);
        return "redirect:/presentation/oferentes/habilidades";
    }

    @GetMapping("/cv")
    public String verCv(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Oferente oferente = obtenerOferenteActual(userDetails);
        model.addAttribute("oferente", oferente);
        prepararDatosSesion(model, userDetails);
        return "presentation/oferente/CV";
    }

    @PostMapping("/cv")
    public String subirCv(@AuthenticationPrincipal UserDetailsImp userDetails,
                          @RequestParam("cv") MultipartFile cv,
                          RedirectAttributes ra) {
        try {
            if (cv == null || cv.isEmpty()) throw new IllegalArgumentException("Debes seleccionar un archivo PDF.");
            String original = cv.getOriginalFilename();
            if (original == null || !original.toLowerCase().endsWith(".pdf"))
                throw new IllegalArgumentException("El archivo debe ser un PDF.");

            Oferente oferente = obtenerOferenteActual(userDetails);


            String nombreArchivo = oferente.getId()+".pdf";
            java.nio.file.Path carpeta = java.nio.file.Paths.get(System.getProperty("user.dir"), "uploads");
            java.nio.file.Files.createDirectories(carpeta);
            java.nio.file.Path destino = carpeta.resolve(nombreArchivo);
            cv.transferTo(destino.toFile());

            oferente.setCv(nombreArchivo);
            service.oferenteUpdate(oferente);
            ra.addFlashAttribute("exito", "CV cargado correctamente.");
        } catch (Exception e) {
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/presentation/oferentes/cv";
    }

    @PostMapping("/cv/eliminar")
    public String eliminarCv(@AuthenticationPrincipal UserDetailsImp userDetails,
                             RedirectAttributes ra) {
        try {
            Oferente oferente = obtenerOferenteActual(userDetails);
            oferente.setCv(null);
            service.oferenteUpdate(oferente);
            ra.addFlashAttribute("exito", "CV eliminado.");
        } catch (Exception e) {
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/presentation/oferentes/cv";
    }
}

package BolsaEmpleo.presentation.empresas;

import BolsaEmpleo.logic.*;
import BolsaEmpleo.security.UserDetailsImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@org.springframework.stereotype.Controller("empresas")
@RequestMapping("/presentation/empresas")
public class Controller {

    @Autowired
    private Service service;

    private Empresa obtenerEmpresaActual(UserDetailsImp userDetails) {
        Usuario usuario = userDetails.getUsuario();

        return service.empresaFindByUsuarioId(usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada para el usuario autenticado"));
    }

    @GetMapping("/show")
    public String showDashboard(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Empresa empresa = obtenerEmpresaActual(userDetails);
        model.addAttribute("empresa", empresa);
        prepararDatosSesion(model, userDetails);
        return "presentation/empresas/Dashboard";
    }

    @GetMapping("/puestos")
    public String misPuestos(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Empresa empresa = obtenerEmpresaActual(userDetails);
        model.addAttribute("puestos", service.puestosFindByEmpresa(empresa));
        model.addAttribute("empresa", empresa);
        prepararDatosSesion(model, userDetails);
        return "presentation/empresas/MisPuestos";
    }

    @GetMapping("/publicar")
    public String mostrarPublicar(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        model.addAttribute("puesto", new Puesto());
        model.addAttribute("arbolCaracteristicas", service.caracteristicasEnArbol());
        prepararDatosSesion(model, userDetails);
        return "presentation/empresas/PublicarPuesto";
    }

    @PostMapping("/publicar")
    public String publicarPuesto(Model model,
                                 @RequestParam("descripcion") String descripcion,
                                 @RequestParam("salario") Double salario,
                                 @RequestParam("tipo") TipoPublicacion tipo,

                                 @RequestParam(value = "activo", required = false) String activo,
                                 @RequestParam(name = "caracteristicasSeleccionadas", required = false) List<Integer> caracteristicasSeleccionadas,
                                 @AuthenticationPrincipal UserDetailsImp userDetails,
                                 jakarta.servlet.http.HttpServletRequest request) {

        try {
            if (caracteristicasSeleccionadas == null || caracteristicasSeleccionadas.isEmpty()) {
                model.addAttribute("error", "Debe seleccionar al menos una característica.");
                model.addAttribute("arbolCaracteristicas", service.caracteristicasEnArbol());
                prepararDatosSesion(model, userDetails);
                return "presentation/empresas/PublicarPuesto";
            }
            Empresa empresa = obtenerEmpresaActual(userDetails);

            Puesto puesto = new Puesto();
            puesto.setDescripcion(descripcion);
            puesto.setSalario(salario);
            puesto.setTipo(tipo);
            puesto.setIdEmpresa(empresa);


                puesto.setFecha(java.time.LocalDate.now());


            puesto.setActivo(activo != null);

            Puesto puestoGuardado = service.puestoSave(puesto);

            if (caracteristicasSeleccionadas != null) {
                for (Integer idCar : caracteristicasSeleccionadas) {
                    Caracteristica caracteristica = service.caracteristicaFindById(idCar)
                            .orElseThrow(() -> new IllegalArgumentException("Característica no encontrada"));

                    String nivelStr = request.getParameter("nivel_" + idCar);
                    Integer nivel = (nivelStr == null || nivelStr.isBlank()) ? 1 : Integer.parseInt(nivelStr);

                    PuestoCaracteristica pc = new PuestoCaracteristica();
                    pc.setIdPuesto(puestoGuardado);
                    pc.setIdCaracteristica(caracteristica);
                    pc.setNivel(nivel);

                    service.puestoCaracteristicaSave(pc);
                }
            }

            return "redirect:/presentation/empresas/puestos";

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", e.getMessage());
            model.addAttribute("puesto", new Puesto());
            model.addAttribute("arbolCaracteristicas", service.caracteristicasEnArbol());
            return "presentation/empresas/PublicarPuesto";
        }
    }
    @GetMapping("/buscar")
    public String buscarCandidatosPorPuesto(@RequestParam(required = false) Integer puestoId,
                                            @AuthenticationPrincipal UserDetailsImp userDetails,
                                            Model model) {

        prepararDatosSesion(model, userDetails);

        if (puestoId == null) {
            model.addAttribute("error", "Falta el id del puesto.");
            return "presentation/empresas/MisPuestos";
        }

        try {
            ResultadoBusquedaCandidatos res = service.buscarCandidatosPorPuesto(puestoId);
            model.addAttribute("puesto", res.getPuesto());
            model.addAttribute("oferentes", res.getOferentes());
            model.addAttribute("requisitosCumplidos", res.getRequisitosCumplidos());
            model.addAttribute("porcentajes", res.getPorcentajes());
            model.addAttribute("totalRequisitos", res.getTotalRequisitos());

            return "presentation/empresas/BuscarCandidatos";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "presentation/empresas/MisPuestos";
        }
    }

    @GetMapping("/desactivar/{id}")
    public String togglePuesto(@PathVariable Integer id) {
        Puesto p = service.puestoFindById(id)
                .orElseThrow(() -> new IllegalArgumentException("Puesto no encontrado"));

        p.setActivo(!p.getActivo());

        service.puestoUpdate(p);

        return "redirect:/presentation/empresas/puestos";
    }
    private void prepararDatosSesion(Model model, UserDetailsImp userDetails) {
        model.addAttribute("correo", userDetails.getUsername());
        model.addAttribute("nombre", userDetails.getUsuario() != null ? userDetails.getUsuario().getNombre() : null);
    }

    @GetMapping("/candidato/{id}")
    public String verDetalleCandidato(@PathVariable("id") Integer id,
                                      @RequestParam(value = "puestoId", required = false) Integer puestoId,
                                      @AuthenticationPrincipal UserDetailsImp userDetails,
                                      Model model) {

        DetalleCandidatoDTO detalle = service.obtenerDetalleCandidato(id, puestoId);

        model.addAttribute("oferente", detalle.getOferente());
        model.addAttribute("habilidades", detalle.getHabilidades());
        model.addAttribute("puesto", detalle.getPuesto());

        prepararDatosSesion(model, userDetails);

        return "presentation/empresas/VerDetalleCandidato";
    }
}
package BolsaEmpleo.presentation.admin;

import BolsaEmpleo.logic.Administrador;
import BolsaEmpleo.logic.Caracteristica;
import BolsaEmpleo.logic.Service;
import BolsaEmpleo.logic.Usuario;
import BolsaEmpleo.security.UserDetailsImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@org.springframework.stereotype.Controller("admin")
@RequestMapping("/presentation/admin")
public class Controller {

    @Autowired
    private Service service;

    private void prepararDatosSesion(Model model, UserDetailsImp userDetails) {
        model.addAttribute("correo", userDetails.getUsername());
        model.addAttribute("nombre", userDetails.getUsuario() != null ? userDetails.getUsuario().getNombre() : null);
    }

    private Administrador obtenerAdminActual(UserDetailsImp userDetails) {
        Usuario usuario = userDetails.getUsuario();

        return service.administradorFindById(usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Administrador no encontrado para el usuario autenticado"));
    }

    @GetMapping("/show")
    public String showDashboard(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Administrador administrador = obtenerAdminActual(userDetails);
        model.addAttribute("administrador", administrador);
        prepararDatosSesion(model, userDetails);
        return "presentation/administrador/Dashboard";
    }

    @GetMapping("/empresasPendientes")
    public String verEmpresasPendientes(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Administrador administrador = obtenerAdminActual(userDetails);
        model.addAttribute("administrador", administrador);
        model.addAttribute("empresas", service.empresasNoAprobadas());
        prepararDatosSesion(model, userDetails);
        return "presentation/administrador/EmpresasPendientes";
    }

    @GetMapping("/oferentesPendientes")
    public String verOferentesPendientes(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Administrador administrador = obtenerAdminActual(userDetails);
        model.addAttribute("administrador", administrador);
        model.addAttribute("oferentes", service.oferentesNoAprobados());
        prepararDatosSesion(model, userDetails);
        return "presentation/administrador/OferentesPendientes";
    }

    @GetMapping("/caracteristicas")
    public String verCaracteristicas(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Administrador administrador = obtenerAdminActual(userDetails);
        model.addAttribute("administrador", administrador);
        model.addAttribute("caracteristicasJerarquicas", service.caracteristicasJerarquicas());
        prepararDatosSesion(model, userDetails);
        return "presentation/administrador/Caracteristicas";
    }

    @PostMapping("/caracteristicas/guardar")
    public String guardarCaracteristica(@RequestParam("nombre") String nombre,
                                        @RequestParam(value = "padreId", required = false) Integer padreId,
                                        @AuthenticationPrincipal UserDetailsImp userDetails,
                                        Model model) {
        try {
            Caracteristica c = new Caracteristica();
            c.setNombre(nombre);

            if (padreId != null) {
                Caracteristica padre = service.caracteristicaFindById(padreId)
                        .orElseThrow(() -> new IllegalArgumentException("Característica padre no encontrada"));
                c.setIdPadre(padre);
            } else {
                c.setIdPadre(null);
            }

            service.caracteristicaSave(c);

            if (padreId != null) {
                return "redirect:/presentation/admin/caracteristicas/" + padreId;
            }
            return "redirect:/presentation/admin/caracteristicas";

        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());

            Administrador administrador = obtenerAdminActual(userDetails);
            model.addAttribute("administrador", administrador);
            model.addAttribute("caracteristicasJerarquicas", service.caracteristicasJerarquicas());
            prepararDatosSesion(model, userDetails);

            return "presentation/administrador/Caracteristicas";
        }
    }

    @GetMapping("/aprobarEmpresa/{id}")
    public String aprobarEmpresa(@PathVariable Integer id,
                                 @AuthenticationPrincipal UserDetailsImp userDetails,
                                 Model model) {
        try {
            service.aprobarEmpresa(id);
            model.addAttribute("mensaje", "Empresa aprobada correctamente");
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
        }
        Administrador admin = obtenerAdminActual(userDetails);
        model.addAttribute("administrador", admin);
        model.addAttribute("empresas", service.empresasNoAprobadas());
        prepararDatosSesion(model, userDetails);

        return "presentation/administrador/EmpresasPendientes";
    }

    @GetMapping("/aprobarOferente/{id}")
    public String aprobarOferente(@PathVariable Integer id,
                                  @AuthenticationPrincipal UserDetailsImp userDetails,
                                  Model model) {
        try {
            service.aprobarOferente(id);
            model.addAttribute("mensaje", "Oferente aprobado correctamente");
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
        }

        Administrador admin = obtenerAdminActual(userDetails);
        model.addAttribute("administrador", admin);
        model.addAttribute("oferentes", service.oferentesNoAprobados());
        prepararDatosSesion(model, userDetails);

        return "presentation/administrador/OferentesPendientes";
    }
    @GetMapping("/caracteristicas/{id}")
    public String verDetalleCaracteristica(@PathVariable Integer id,
                                           @AuthenticationPrincipal UserDetailsImp userDetails,
                                           Model model) {
        Administrador administrador = obtenerAdminActual(userDetails);

        Caracteristica actual = service.caracteristicaFindById(id)
                .orElseThrow(() -> new IllegalArgumentException("Característica no encontrada"));

        model.addAttribute("administrador", administrador);
        model.addAttribute("caracteristicaActual", actual);
        model.addAttribute("hijas", service.caracteristicasHijas(id));
        model.addAttribute("ruta", service.rutaCaracteristica(id));
        model.addAttribute("padre", actual.getIdPadre());

        prepararDatosSesion(model, userDetails);
        return "presentation/administrador/CaracteristicaDetalle";
    }

    @GetMapping("/reportes")
    public String verReportes(@AuthenticationPrincipal UserDetailsImp userDetails, Model model) {
        Administrador administrador = obtenerAdminActual(userDetails);

        model.addAttribute("administrador", administrador);
        model.addAttribute("puestos", java.util.Collections.emptyList());
        model.addAttribute("mesSeleccionado", null);
        model.addAttribute("anioSeleccionado", null);
        model.addAttribute("total", 0);

        prepararDatosSesion(model, userDetails);
        return "presentation/administrador/Reportes";
    }

    @GetMapping("/reportes/puestos")
    public String reportePuestosPorMesYAnio(@RequestParam("mes") Integer mes,
                                            @RequestParam("anio") Integer anio,
                                            @AuthenticationPrincipal UserDetailsImp userDetails,
                                            Model model) {
        Administrador administrador = obtenerAdminActual(userDetails);

        java.util.List<BolsaEmpleo.logic.Puesto> puestos = service.puestosPorMesYAnio(mes, anio);

        model.addAttribute("administrador", administrador);
        model.addAttribute("puestos", puestos);
        model.addAttribute("mesSeleccionado", mes);
        model.addAttribute("anioSeleccionado", anio);
        model.addAttribute("total", puestos.size());

        prepararDatosSesion(model, userDetails);
        return "presentation/administrador/Reportes";
    }

    @GetMapping("/reportes/puestos/pdf")
    public ResponseEntity<byte[]> exportarReportePuestosPdf(@RequestParam("mes") Integer mes,
                                                            @RequestParam("anio") Integer anio,
                                                            @AuthenticationPrincipal UserDetailsImp userDetails) {
        try {
            java.util.List<BolsaEmpleo.logic.Puesto> puestos = service.puestosPorMesYAnio(mes, anio);

            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();

            com.lowagie.text.Document document = new com.lowagie.text.Document();
            com.lowagie.text.pdf.PdfWriter.getInstance(document, baos);

            document.open();

            com.lowagie.text.Font tituloFont = new com.lowagie.text.Font(
                    com.lowagie.text.Font.HELVETICA, 16, com.lowagie.text.Font.BOLD
            );
            com.lowagie.text.Font textoFont = new com.lowagie.text.Font(
                    com.lowagie.text.Font.HELVETICA, 11
            );

            document.add(new com.lowagie.text.Paragraph("Reporte de puestos publicados", tituloFont));
            document.add(new com.lowagie.text.Paragraph("Mes: " + mes + "  Año: " + anio, textoFont));
            document.add(new com.lowagie.text.Paragraph("Total de puestos: " + puestos.size(), textoFont));
            document.add(new com.lowagie.text.Paragraph(" "));

            com.lowagie.text.pdf.PdfPTable tabla = new com.lowagie.text.pdf.PdfPTable(6);
            tabla.setWidthPercentage(100);

            tabla.addCell("ID");
            tabla.addCell("Empresa");
            tabla.addCell("Descripción");
            tabla.addCell("Salario");
            tabla.addCell("Tipo");
            tabla.addCell("Fecha");

            for (BolsaEmpleo.logic.Puesto p : puestos) {
                tabla.addCell(String.valueOf(p.getId()));
                tabla.addCell(p.getIdEmpresa().getUsuario().getNombre());
                tabla.addCell(p.getDescripcion() != null ? p.getDescripcion() : "");
                tabla.addCell(String.valueOf(p.getSalario()));
                tabla.addCell(p.getTipo() != null ? p.getTipo().toString() : "");
                tabla.addCell(p.getFecha() != null ? p.getFecha().toString() : "");
            }

            document.add(tabla);
            document.close();

            String nombreArchivo = "reporte_puestos_" + anio + "_" + mes + ".pdf";

            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + nombreArchivo)
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .body(baos.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
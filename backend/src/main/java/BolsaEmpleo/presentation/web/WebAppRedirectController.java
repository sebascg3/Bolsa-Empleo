package BolsaEmpleo.presentation.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class WebAppRedirectController {

    @GetMapping({"/", "/login", "/registro/oferente", "/registro/empresa", "/puestos/buscar"})
    public String redirectKnownScreens(HttpServletRequest request) {
        String uri = request.getRequestURI();

        if ("/login".equals(uri)) {
            return "redirect:/app/#login";
        }
        if ("/registro/oferente".equals(uri)) {
            return "redirect:/app/#register-oferente";
        }
        if ("/registro/empresa".equals(uri)) {
            return "redirect:/app/#register-empresa";
        }
        if ("/puestos/buscar".equals(uri)) {
            return "redirect:/app/#search";
        }
        return "redirect:/app/#home";
    }

    @GetMapping("/presentation/**")
    public String redirectLegacyPresentation(HttpServletRequest request) {
        String uri = request.getRequestURI();

        if (uri.startsWith("/presentation/admin")) {
            return "redirect:/app/#admin";
        }
        if (uri.startsWith("/presentation/empresas")) {
            return "redirect:/app/#empresa";
        }
        if (uri.startsWith("/presentation/oferentes")) {
            return "redirect:/app/#oferente";
        }
        return "redirect:/app/#home";
    }
}


package BolsaEmpleo.presentation.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({"/app", "/app/"})
    public String app() {
        return "forward:/app/index.html";
    }
}


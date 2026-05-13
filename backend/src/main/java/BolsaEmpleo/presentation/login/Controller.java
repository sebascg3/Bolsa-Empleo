package BolsaEmpleo.presentation.login;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@org.springframework.stereotype.Controller("login")
@RequestMapping("/login")
public class Controller {

    @GetMapping("")
    public String showLogin() {
        return "presentation/login/LoginView";
    }
}
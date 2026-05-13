package BolsaEmpleo.presentation.api;

import BolsaEmpleo.api.dto.AuthResponse;
import BolsaEmpleo.api.dto.LoginRequest;
import BolsaEmpleo.api.dto.UserInfoResponse;
import BolsaEmpleo.logic.Usuario;
import BolsaEmpleo.security.JwtService;
import BolsaEmpleo.security.UserDetailsImp;
import org.springframework.security.core.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.usuario(), request.password())
            );

            UserDetailsImp userDetails = (UserDetailsImp) authentication.getPrincipal();
            Usuario usuario = userDetails.getUsuario();
            String token = jwtService.generarToken(usuario);

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    "Bearer",
                    jwtService.expiracionDesdeAhora(),
                    toUserInfo(usuario)
            ));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/me")
    public UserInfoResponse me(@AuthenticationPrincipal UserDetailsImp userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado");
        }
        return toUserInfo(userDetails.getUsuario());
    }

    @GetMapping("/verify")
    public ResponseEntity<Void> verify(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok().build();
    }

    private UserInfoResponse toUserInfo(Usuario usuario) {
        return new UserInfoResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name()
        );
    }
}


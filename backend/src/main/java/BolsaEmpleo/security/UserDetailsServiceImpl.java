package BolsaEmpleo.security;

import BolsaEmpleo.data.EmpresaRepository;
import BolsaEmpleo.data.OferenteRepository;
import BolsaEmpleo.data.UsuarioRepository;
import BolsaEmpleo.logic.Empresa;
import BolsaEmpleo.logic.Oferente;
import BolsaEmpleo.logic.Rol;
import BolsaEmpleo.logic.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private OferenteRepository oferenteRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Correo " + correo + " no encontrado"));
        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new DisabledException("Tu cuenta está inactiva");
        }
        if (usuario.getRol() == Rol.EMPRESA) {
            Empresa empresa = empresaRepository.findByUsuarioId(usuario.getId())
                    .orElseThrow(() -> new UsernameNotFoundException("Empresa no encontrada"));

            if (!Boolean.TRUE.equals(empresa.getAprobado())) {
                throw new DisabledException("Tu cuenta de empresa aún no ha sido aprobada");
            }
        }

        if (usuario.getRol() == Rol.OFERENTE) {
            Oferente oferente = oferenteRepository.findByUsuarioId(usuario.getId())
                    .orElseThrow(() -> new UsernameNotFoundException("Oferente no encontrado"));

            if (!Boolean.TRUE.equals(oferente.getAprobado())) {
                throw new DisabledException("Tu cuenta de oferente aún no ha sido aprobada");
            }
        }

        return new UserDetailsImp(usuario);
    }
}
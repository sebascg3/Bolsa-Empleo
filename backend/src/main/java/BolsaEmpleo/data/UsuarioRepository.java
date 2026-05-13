package BolsaEmpleo.data;

import BolsaEmpleo.logic.Rol;
import BolsaEmpleo.logic.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCorreo(String correo);

    List<Usuario> findByRol(Rol rol);

    List<Usuario> findByActivo(Boolean activo);

    List<Usuario> findByNombreContaining(String nombre);

    List<Usuario> findByNombreContainingAndActivo(String nombre, Boolean activo);

    Optional<Usuario> findByCorreoAndActivo(String correo, Boolean activo);

    List<Usuario> findByRolAndActivo(Rol rol, Boolean activo);

    boolean existsByCorreo(String correo);
    Optional<Usuario> findByCorreoAndPassword(String correo, String password);
}
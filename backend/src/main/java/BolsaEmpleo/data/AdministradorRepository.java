package BolsaEmpleo.data;

import BolsaEmpleo.logic.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findByIdentificacion(String identificacion);

    Iterable<Administrador> findByActivo(Boolean activo);
    Administrador findByUsuarioCorreo(String correo);
    Administrador findByUsuarioNombre(String nombre);

}
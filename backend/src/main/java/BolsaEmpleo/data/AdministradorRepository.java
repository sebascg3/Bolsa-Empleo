package BolsaEmpleo.data;

import BolsaEmpleo.logic.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findByIdentificacion(String identificacion);

    @Query("select a from Administrador a join fetch a.usuario where a.identificacion = :identificacion")
    Optional<Administrador> findByIdentificacionFetch(@Param("identificacion") String identificacion);

    Iterable<Administrador> findByActivo(Boolean activo);
    Administrador findByUsuarioCorreo(String correo);
    Administrador findByUsuarioNombre(String nombre);

}
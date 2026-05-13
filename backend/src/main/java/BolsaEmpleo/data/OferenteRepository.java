package BolsaEmpleo.data;

import BolsaEmpleo.logic.Oferente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OferenteRepository extends JpaRepository<Oferente, Integer> {

    List<Oferente> findByUsuarioNombre(String nombre);

    Oferente findByIdentificacion(String identificacion);
    List<Oferente> findByAprobadoTrue();
    List<Oferente> findByAprobadoFalse();
    Optional<Oferente> findByUsuarioId(Integer usuarioId);
    @Query("select o from Oferente o join fetch o.usuario u where u.correo = :correo")
    Optional<Oferente> findByUsuarioCorreoFetch(String correo);
}
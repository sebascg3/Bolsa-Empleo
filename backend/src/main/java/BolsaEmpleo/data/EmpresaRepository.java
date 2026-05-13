package BolsaEmpleo.data;

import BolsaEmpleo.logic.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {

    List<Empresa> findByUsuarioNombreContaining(String nombre);

    Empresa findByUsuarioCorreo(String correo);
    List<Empresa> findByAprobadoTrue();
    List<Empresa> findByAprobadoFalse();
    Optional<Empresa> findByUsuarioId(Integer usuarioId);
}
package BolsaEmpleo.data;

import BolsaEmpleo.logic.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Integer> {

    List<Caracteristica> findByNombreContaining(String nombre);

    List<Caracteristica> findByIdPadreId(Integer idPadre);

    List<Caracteristica> findByIdPadreIsNull();

    List<Caracteristica> findByNombreContainingAndIdPadreIsNull(String nombre);
}
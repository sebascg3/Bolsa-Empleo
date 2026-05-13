package BolsaEmpleo.data;

import BolsaEmpleo.logic.PuestoCaracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuestoCaracteristicaRepository extends JpaRepository<PuestoCaracteristica, Integer> {

    List<PuestoCaracteristica> findByIdPuestoId(Integer idPuesto);

    List<PuestoCaracteristica> findByIdCaracteristicaId(Integer idCaracteristica);

    List<PuestoCaracteristica> findByIdPuestoIdAndIdCaracteristicaId(Integer idPuesto, Integer idCaracteristica);

    List<PuestoCaracteristica> findByNivel(Integer nivel);

    List<PuestoCaracteristica> findByIdPuestoIdAndNivel(Integer idPuesto, Integer nivel);
}
package BolsaEmpleo.data;

import BolsaEmpleo.logic.CaracteristicaOferente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OferenteCaracteristicaRepository extends JpaRepository<CaracteristicaOferente, Integer> {

    List<CaracteristicaOferente> findByIdOferenteId(Integer idOferente);

    List<CaracteristicaOferente> findByIdCaracteristicaId(Integer idCaracteristica);

    List<CaracteristicaOferente> findByIdOferenteIdAndIdCaracteristicaId(Integer idOferente, Integer idCaracteristica);

    List<CaracteristicaOferente> findByNivel(Integer nivel);

    List<CaracteristicaOferente> findByIdOferenteIdAndNivel(Integer idOferente, Integer nivel);

    @Query("""
           select co
           from CaracteristicaOferente co
           join fetch co.idOferente o
           join fetch co.idCaracteristica c
           where o.id = :idOferente
           """)
    List<CaracteristicaOferente> findByIdOferenteIdFetch(@Param("idOferente") Integer idOferente);

}
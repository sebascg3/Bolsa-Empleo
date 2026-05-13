package BolsaEmpleo.data;

import BolsaEmpleo.logic.Empresa;
import BolsaEmpleo.logic.Puesto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PuestoRepository extends JpaRepository<Puesto, Integer> {
    List<Puesto> findByIdEmpresa(Empresa empresa);
    List<Puesto> findByIdEmpresaId(Integer idEmpresa);

    List<Puesto> findByActivo(Boolean activo);

    @Query("SELECT p FROM Puesto p " +
            "JOIN FETCH p.idEmpresa e " +
            "JOIN FETCH e.usuario u " +
            "WHERE MONTH(p.fecha) = :mes AND YEAR(p.fecha) = :anio")
    List<Puesto> findByMesAndAnio(@Param("mes") int mes, @Param("anio") int anio);

    List<Puesto> findByIdEmpresaIdAndActivo(Integer idEmpresa, Boolean activo);

    List<Puesto> findByDescripcionContaining(String descripcion);

    List<Puesto> findByFecha(LocalDate fecha);

    List<Puesto> findByIdEmpresaAndActivoTrue(Empresa empresa);

    List<Puesto> findByActivoTrue();

    @Query("select p.id from Puesto p where p.activo = true order by p.id desc")
    List<Integer> findUltimos5Ids(Pageable pageable);
    @Query("""
SELECT DISTINCT p
FROM Puesto p
JOIN FETCH p.idEmpresa e
JOIN FETCH e.usuario
LEFT JOIN FETCH p.puestoCaracteristicas pc
LEFT JOIN FETCH pc.idCaracteristica
WHERE p.id IN :ids
ORDER BY p.id DESC
""")
    List<Puesto> findConDetallesByIds(@Param("ids") List<Integer> ids);
}
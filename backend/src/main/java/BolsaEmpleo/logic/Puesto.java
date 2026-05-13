package BolsaEmpleo.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "puesto", indexes = {
        @Index(name = "idx_puesto_empresa", columnList = "id_empresa")
})
public class Puesto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_puesto", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa idEmpresa;

    @Size(max = 300)
    @Column(name = "descripcion", length = 300)
    private String descripcion;

    @NotNull
    @Column(name = "salario", nullable = false)
    private Double salario;

    @NotNull

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoPublicacion tipo;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "activo", nullable = false)
    private Boolean activo = false;

    @NotNull
    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @OneToMany(mappedBy = "idPuesto", fetch = FetchType.LAZY)
    private List<PuestoCaracteristica> puestoCaracteristicas;
}
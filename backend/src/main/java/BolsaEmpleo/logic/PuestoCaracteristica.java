package BolsaEmpleo.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "puesto_caracteristica", indexes = {
        @Index(name = "idx_pc_puesto", columnList = "id_puesto"),
        @Index(name = "idx_pc_caracteristica", columnList = "id_caracteristica")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_puesto_caracteristica", columnNames = {"id_puesto", "id_caracteristica"})
})
public class PuestoCaracteristica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_puesto_carac", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_puesto", nullable = false)
    private Puesto idPuesto;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_caracteristica", nullable = false)
    private Caracteristica idCaracteristica;

    @NotNull
    @Column(name = "nivel", nullable = false)
    private Integer nivel;

}
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
@Table(name = "caracteristica_oferente", indexes = {
        @Index(name = "idx_co_oferente", columnList = "id_oferente"),
        @Index(name = "idx_co_caracteristica", columnList = "id_caracteristica")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_oferente_caracteristica", columnNames = {"id_oferente", "id_caracteristica"})
})
public class CaracteristicaOferente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carac_ofer", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_oferente", nullable = false)
    private Oferente idOferente;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_caracteristica", nullable = false)
    private Caracteristica idCaracteristica;

    @Column(name = "nivel")
    private Integer nivel;

}
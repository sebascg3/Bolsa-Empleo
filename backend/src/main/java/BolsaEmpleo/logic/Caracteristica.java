package BolsaEmpleo.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "caracteristica", indexes = {
        @Index(name = "idx_caracteristica_padre", columnList = "id_padre")
})
public class Caracteristica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_caracteristica", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "nombre", length = 45)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "id_padre")
    private Caracteristica idPadre;

}
package BolsaEmpleo.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "oferente", uniqueConstraints = {
        @UniqueConstraint(name = "uk_oferente_identificacion", columnNames = {"identificacion"})
})
public class Oferente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_oferente", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_oferente", nullable = false)
    private Usuario usuario;

    @Size(max = 45)
    @NotNull
    @Column(name = "identificacion", nullable = false, length = 45)
    private String identificacion;



    @Size(max = 45)
    @Column(name = "nacionalidad", length = 45)
    private String nacionalidad;

    @Size(max = 45)
    @Column(name = "telefono", length = 45)
    private String telefono;

    @Size(max = 45)
    @Column(name = "residencia", length = 45)
    private String residencia;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "aprobado", nullable = false)
    private Boolean aprobado = false;

    @Size(max = 300)
    @Column(name = "cv", length = 300)
    private String cv;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

}
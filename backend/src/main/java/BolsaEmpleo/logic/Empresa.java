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
@Table(name = "empresa")
public class Empresa {
    @Id
    @Column(name = "id_empresa", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Usuario usuario;

    @Size(max = 40)
    @Column(name = "ubicacion", length = 40)
    private String ubicacion;

    @Size(max = 20)
    @Column(name = "telefono", length = 20)
    private String telefono;

    @Size(max = 300)
    @Column(name = "descripcion", length = 300)
    private String descripcion;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "aprobado", nullable = false)
    private Boolean aprobado = false;

}
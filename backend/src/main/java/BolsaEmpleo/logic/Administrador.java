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
@Table(name = "administrador")
public class Administrador {
    @Id
    @Column(name = "id_administrador", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_administrador", nullable = false)
    private Usuario usuario;

    @Size(max = 45)
    @NotNull
    @Column(name = "identificacion", nullable = false, length = 45)
    private String identificacion;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "activo", nullable = false)
    private Boolean activo = false;

}
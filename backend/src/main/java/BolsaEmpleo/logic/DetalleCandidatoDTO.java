package BolsaEmpleo.logic;

import java.util.List;

public class DetalleCandidatoDTO {
    private Oferente oferente;
    private List<CaracteristicaOferente> habilidades;
    private Puesto puesto;

    public DetalleCandidatoDTO(Oferente oferente, List<CaracteristicaOferente> habilidades, Puesto puesto) {
        this.oferente = oferente;
        this.habilidades = habilidades;
        this.puesto = puesto;
    }

    public Oferente getOferente() {
        return oferente;
    }

    public List<CaracteristicaOferente> getHabilidades() {
        return habilidades;
    }

    public Puesto getPuesto() {
        return puesto;
    }
}
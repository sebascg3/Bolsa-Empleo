package BolsaEmpleo.logic;

import java.util.ArrayList;
import java.util.List;

public class NodoCaracteristica {
    private Caracteristica caracteristica;
    private List<NodoCaracteristica> hijos = new ArrayList<>();

    public NodoCaracteristica() {
    }

    public NodoCaracteristica(Caracteristica caracteristica) {
        this.caracteristica = caracteristica;
    }

    public Caracteristica getCaracteristica() {
        return caracteristica;
    }

    public void setCaracteristica(Caracteristica caracteristica) {
        this.caracteristica = caracteristica;
    }

    public List<NodoCaracteristica> getHijos() {
        return hijos;
    }

    public void setHijos(List<NodoCaracteristica> hijos) {
        this.hijos = hijos;
    }
}
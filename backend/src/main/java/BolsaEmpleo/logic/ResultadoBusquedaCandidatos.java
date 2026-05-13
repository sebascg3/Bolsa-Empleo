package BolsaEmpleo.logic;

import java.util.List;
import java.util.Map;

public class ResultadoBusquedaCandidatos {
    private Puesto puesto;
    private List<Oferente> oferentes;
    private Map<Integer, Integer> requisitosCumplidos;
    private Map<Integer, Integer> porcentajes;
    private int totalRequisitos;

    public ResultadoBusquedaCandidatos(Puesto puesto,
                                       List<Oferente> oferentes,
                                       Map<Integer, Integer> requisitosCumplidos,
                                       Map<Integer, Integer> porcentajes,
                                       int totalRequisitos) {
        this.puesto = puesto;
        this.oferentes = oferentes;
        this.requisitosCumplidos = requisitosCumplidos;
        this.porcentajes = porcentajes;
        this.totalRequisitos = totalRequisitos;
    }

    public Puesto getPuesto() {
        return puesto;
    }

    public List<Oferente> getOferentes() {
        return oferentes;
    }

    public Map<Integer, Integer> getRequisitosCumplidos() {
        return requisitosCumplidos;
    }

    public Map<Integer, Integer> getPorcentajes() {
        return porcentajes;
    }

    public int getTotalRequisitos() {
        return totalRequisitos;
    }
}
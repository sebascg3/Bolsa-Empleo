package BolsaEmpleo.logic;
import BolsaEmpleo.data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;

@org.springframework.stereotype.Service
public class Service {


    @Autowired
    private PasswordEncoder passwordEncoder;
    public Optional<Oferente> oferenteFindByUsuarioCorreo(String correo) {
        return oferenteRepository.findByUsuarioCorreoFetch(correo);
    }

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private OferenteRepository oferenteRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    @Autowired
    private PuestoRepository puestoRepository;

    @Autowired
    private PuestoCaracteristicaRepository puestoCaracteristicaRepository;

    @Autowired
    private OferenteCaracteristicaRepository oferenteCaracteristicaRepository;





    public void empresaDelete(int id) {
        empresaRepository.deleteById(id);
    }



    public Oferente oferenteUpdate(Oferente o) {
        if (!oferenteRepository.existsById(o.getId())) {
            throw new IllegalArgumentException("Oferente no existe");
        }
        return oferenteRepository.save(o);
    }

    public void oferenteDelete(int id) {
        oferenteRepository.deleteById(id);
    }






    public Iterable<Caracteristica> caracteristicasFindAll() {
        return caracteristicaRepository.findAll();
    }

    public Caracteristica caracteristicaSave(Caracteristica c) {
        return caracteristicaRepository.save(c);
    }

    public Optional<Caracteristica> caracteristicaFindById(int id) {
        return caracteristicaRepository.findById(id);
    }

    public Caracteristica caracteristicaUpdate(Caracteristica c) {
        if (!caracteristicaRepository.existsById(c.getId())) {
            throw new IllegalArgumentException("Caracteristica no existe");
        }
        return caracteristicaRepository.save(c);
    }

    public void caracteristicaDelete(int id) {
        caracteristicaRepository.deleteById(id);
    }


    public Puesto puestoSave(Puesto p) {
        puestoRepository.save(p);
        return p;
    }
    public java.util.Map<Caracteristica, java.util.List<Caracteristica>> caracteristicasJerarquicas() {
        List<Caracteristica> todas = new ArrayList<>(caracteristicaRepository.findAll());

        java.util.Map<Integer, Caracteristica> padresPorId = new java.util.LinkedHashMap<>();
        java.util.Map<Caracteristica, java.util.List<Caracteristica>> jerarquia = new java.util.LinkedHashMap<>();

        for (Caracteristica c : todas) {
            if (c.getIdPadre() == null) {
                padresPorId.put(c.getId(), c);
                jerarquia.put(c, new java.util.ArrayList<>());
            }
        }

        for (Caracteristica c : todas) {
            if (c.getIdPadre() != null) {
                Caracteristica padreReal = padresPorId.get(c.getIdPadre().getId());
                if (padreReal != null) {
                    jerarquia.get(padreReal).add(c);
                }
            }
        }

        return jerarquia;
    }
    public Optional<Puesto> puestoFindById(int id) {
        return puestoRepository.findById(id);
    }

    public Puesto puestoUpdate(Puesto p) {
        if (!puestoRepository.existsById(p.getId())) {
            throw new IllegalArgumentException("Puesto no existe");
        }
        return puestoRepository.save(p);
    }

    public void puestoDelete(int id) {
        puestoRepository.deleteById(id);
    }
    public List<Puesto> puestosFindAll() {
        return puestoRepository.findByActivoTrue();
    }

    public List<Puesto> puestosVisibles(boolean incluirPrivados) {
        List<Puesto> puestos = new ArrayList<>();
        for (Puesto puesto : puestoRepository.findByActivoTrue()) {
            if (incluirPrivados || puesto.getTipo() == TipoPublicacion.PUBLICO) {
                puestos.add(puesto);
            }
        }
        puestos.sort(Comparator.comparing(Puesto::getId, Comparator.nullsLast(Comparator.naturalOrder())).reversed());
        return puestos;
    }

    public Iterable<PuestoCaracteristica> puestoCaracteristicasFindAll() {
        return puestoCaracteristicaRepository.findAll();
    }

    public PuestoCaracteristica puestoCaracteristicaSave(PuestoCaracteristica pc) {
        return puestoCaracteristicaRepository.save(pc);
    }

    public Optional<PuestoCaracteristica> puestoCaracteristicaFindById(int id) {
        return puestoCaracteristicaRepository.findById(id);
    }

    public void puestoCaracteristicaDelete(int id) {
        puestoCaracteristicaRepository.deleteById(id);
    }


    public Iterable<CaracteristicaOferente> oferenteCaracteristicasFindAll() {
        return oferenteCaracteristicaRepository.findAll();
    }
    public void desactivarPuesto(Integer id) {
        Puesto p = puestoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Puesto no encontrado"));

        p.setActivo(false);
        puestoRepository.save(p);
    }
    public CaracteristicaOferente oferenteCaracteristicaSave(CaracteristicaOferente oc) {
        return oferenteCaracteristicaRepository.save(oc);
    }

    public Optional<CaracteristicaOferente> oferenteCaracteristicaFindById(int id) {
        return oferenteCaracteristicaRepository.findById(id);
    }

    public void oferenteCaracteristicaDelete(int id) {
        oferenteCaracteristicaRepository.deleteById(id);
    }

    @Transactional
    public List<CaracteristicaOferente> reemplazarCaracteristicasOferente(Oferente oferente,
                                                                          List<Integer> seleccionadas,
                                                                          Map<Integer, Integer> niveles) {
        List<CaracteristicaOferente> actuales = new ArrayList<>(oferenteCaracteristicasPorOferente(oferente.getId()));
        Set<Integer> seleccionUnica = seleccionadas == null ? Collections.emptySet() : new LinkedHashSet<>(seleccionadas);
        Map<Integer, CaracteristicaOferente> actualesPorCaracteristica = actuales.stream()
                .collect(Collectors.toMap(
                        co -> co.getIdCaracteristica().getId(),
                        co -> co,
                        (a, b) -> a,
                        HashMap::new
                ));

        for (CaracteristicaOferente actual : actuales) {
            Integer idCaracteristica = actual.getIdCaracteristica().getId();
            if (!seleccionUnica.contains(idCaracteristica)) {
                oferenteCaracteristicaRepository.delete(actual);
            }
        }

        oferenteCaracteristicaRepository.flush();

        for (Integer idCaracteristica : seleccionUnica) {
            Caracteristica caracteristica = caracteristicaFindById(idCaracteristica)
                    .orElseThrow(() -> new IllegalArgumentException("Característica no encontrada"));
            Integer nivel = niveles != null && niveles.get(idCaracteristica) != null ? niveles.get(idCaracteristica) : 1;

            CaracteristicaOferente actual = actualesPorCaracteristica.get(idCaracteristica);
            if (actual == null) {
                actual = new CaracteristicaOferente();
                actual.setIdOferente(oferente);
                actual.setIdCaracteristica(caracteristica);
            }
            actual.setNivel(nivel);
            oferenteCaracteristicaRepository.save(actual);
        }

        return oferenteCaracteristicasPorOferente(oferente.getId());
    }



    public void registrarOferente(Usuario usuario, Oferente oferente) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol(Rol.OFERENTE);
        usuario.setActivo(true);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        oferente.setUsuario(usuarioGuardado);
        oferenteRepository.save(oferente);
    }

    public void registrarEmpresa(Usuario usuario, Empresa empresa) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol(Rol.EMPRESA);
        usuario.setActivo(true);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        empresa.setUsuario(usuarioGuardado);
        empresaRepository.save(empresa);
    }
    public Iterable<Puesto> puestosVisiblesRecientes(boolean incluirPrivados) {
        List<Puesto> visibles = puestosVisibles(incluirPrivados);
        if (visibles.isEmpty()) {
            return Collections.emptyList();
        }
        return visibles.subList(0, Math.min(5, visibles.size()));
    }

    public Iterable<Puesto> puestosPublicosRecientes() {
        return puestosVisiblesRecientes(false);
    }
    public List<Empresa> empresasAprobadas() {
        return empresaRepository.findByAprobadoTrue();
    }
    public List<Empresa> empresasNoAprobadas() {
        return empresaRepository.findByAprobadoFalse();
    }
    public Optional<Administrador> administradorFindById(Integer id) {
        return administradorRepository.findById(id);

    }
    private List<Integer> expandirCaracteristicasSeleccionadas(List<Integer> idsOriginales) {
        java.util.Set<Integer> idsResultado = new java.util.LinkedHashSet<>();

        for (Integer id : idsOriginales) {
            agregarCaracteristicaYDescendientes(id, idsResultado);
        }

        return new ArrayList<>(idsResultado);
    }

    private void agregarCaracteristicaYDescendientes(Integer idCaracteristica, java.util.Set<Integer> acumulado) {
        if (idCaracteristica == null || acumulado.contains(idCaracteristica)) {
            return;
        }

        acumulado.add(idCaracteristica);

        List<Caracteristica> hijas = caracteristicaRepository.findByIdPadreId(idCaracteristica);
        for (Caracteristica hija : hijas) {
            agregarCaracteristicaYDescendientes(hija.getId(), acumulado);
        }
    }

    public Integer porcentajeCoincidenciaPuesto(Puesto puesto, List<Integer> idsCaracteristicas) {
        if (puesto == null || idsCaracteristicas == null || idsCaracteristicas.isEmpty()) {
            return 0;
        }

        Set<Integer> caracteristicasPuesto = new java.util.LinkedHashSet<>();
        for (PuestoCaracteristica pc : puestoCaracteristicasPorPuesto(puesto.getId())) {
            if (pc.getIdCaracteristica() != null && pc.getIdCaracteristica().getId() != null) {
                caracteristicasPuesto.add(pc.getIdCaracteristica().getId());
            }
        }

        int coincidencias = 0;
        for (Integer seleccionada : idsCaracteristicas) {
            List<Integer> expandida = expandirCaracteristicasSeleccionadas(java.util.List.of(seleccionada));
            for (Integer idPuesto : caracteristicasPuesto) {
                if (expandida.contains(idPuesto)) {
                    coincidencias++;
                    break;
                }
            }
        }

        return (coincidencias * 100) / idsCaracteristicas.size();
    }
    public List<Puesto> buscarPuestosPorCaracteristicas(List<Integer> idsCaracteristicas) {
        return buscarPuestosPorCaracteristicas(idsCaracteristicas, false);
    }

    public List<Puesto> buscarPuestosPorCaracteristicas(List<Integer> idsCaracteristicas, boolean incluirPrivados) {
        if (idsCaracteristicas == null || idsCaracteristicas.isEmpty()) {
            return puestosVisibles(incluirPrivados);
        }

        List<Puesto> puestos = puestosVisibles(incluirPrivados);
        List<Puesto> resultado = new ArrayList<>();

        List<Integer> idsExpandidos = expandirCaracteristicasSeleccionadas(idsCaracteristicas);

        for (Puesto puesto : puestos) {
            boolean coincideConAlguna = false;

            for (Integer idCar : idsExpandidos) {
                List<PuestoCaracteristica> relaciones =
                        puestoCaracteristicaRepository.findByIdPuestoIdAndIdCaracteristicaId(puesto.getId(), idCar);

                if (!relaciones.isEmpty()) {
                    coincideConAlguna = true;
                    break;
                }
            }

            if (coincideConAlguna) {
                resultado.add(puesto);
            }
        }

        return resultado;
    }

    public Optional<Empresa> empresaFindByUsuarioId(Integer usuarioId) {
        return empresaRepository.findByUsuarioId(usuarioId);
    }
    public List<Puesto> puestosFindByEmpresa(Empresa empresa) {
        return puestoRepository.findByIdEmpresa(empresa);
    }
    public List<Oferente> oferentesList() {
        return oferenteRepository.findByAprobadoTrue();
    }
    public List<Oferente> oferentesNoAprobados() {
        return oferenteRepository.findByAprobadoFalse();
    }
    public List<PuestoCaracteristica> puestoCaracteristicasPorPuesto(Integer idPuesto) {
        return puestoCaracteristicaRepository.findByIdPuestoId(idPuesto);
    }

    public List<CaracteristicaOferente> oferenteCaracteristicasPorOferente(Integer idOferente) {
        return oferenteCaracteristicaRepository.findByIdOferenteIdFetch(idOferente);
    }
    public ResultadoBusquedaCandidatos buscarCandidatosPorPuesto(Integer puestoId) {
        Puesto puesto = puestoFindById(puestoId)
                .orElseThrow(() -> new IllegalArgumentException("Puesto no encontrado"));

        List<PuestoCaracteristica> requisitos = puestoCaracteristicasPorPuesto(puestoId);
        List<Oferente> oferentes = oferentesList();

        java.util.Map<Integer, Integer> requisitosCumplidos = new java.util.HashMap<>();
        java.util.Map<Integer, Integer> porcentajes = new java.util.HashMap<>();
        List<Oferente> oferentesCoinciden = new ArrayList<>();

        int totalRequisitos = requisitos.size();

        for (Oferente oferente : oferentes) {
            List<CaracteristicaOferente> habilidades =
                    oferenteCaracteristicasPorOferente(oferente.getId());

            int cumplidos = 0;

            for (PuestoCaracteristica req : requisitos) {
                List<Integer> idsRequisito = expandirCaracteristicasSeleccionadas(
                        java.util.List.of(req.getIdCaracteristica().getId())
                );
                int nivelRequerido = req.getNivel() == null ? 1 : req.getNivel();


                for (CaracteristicaOferente hab : habilidades) {
                    int nivelCandidato = hab.getNivel() == null ? 0 : hab.getNivel();
                    if (idsRequisito.contains(hab.getIdCaracteristica().getId()) && nivelCandidato >= nivelRequerido) {
                        cumplidos++;
                        break;
                    }
                }
            }

            if (cumplidos > 0) {
                int porcentaje = 0;
                if (totalRequisitos > 0) {
                    porcentaje = (cumplidos * 100) / totalRequisitos;
                }

                oferentesCoinciden.add(oferente);
                requisitosCumplidos.put(oferente.getId(), cumplidos);
                porcentajes.put(oferente.getId(), porcentaje);
            }
        }

        return new ResultadoBusquedaCandidatos(
                puesto,
                oferentesCoinciden,
                requisitosCumplidos,
                porcentajes,
                totalRequisitos
        );
    }

    public DetalleCandidatoDTO obtenerDetalleCandidato(Integer oferenteId, Integer puestoId) {

        Oferente oferente = oferenteRepository.findById(oferenteId)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado"));

        List<CaracteristicaOferente> habilidades =
                oferenteCaracteristicasPorOferente(oferenteId);

        Puesto puesto = null;
        if (puestoId != null) {
            puesto = puestoRepository.findById(puestoId).orElse(null);
        }

        return new DetalleCandidatoDTO(oferente, habilidades, puesto);
    }

    public void aprobarEmpresa(Integer id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        empresa.setAprobado(true);

        empresaRepository.save(empresa);
    }
    public void aprobarOferente(Integer id) {
        Oferente oferente = oferenteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        oferente.setAprobado(true);

        oferenteRepository.save(oferente);
    }

    public List<Caracteristica> caracteristicasHijas(Integer padreId) {
        return caracteristicaRepository.findByIdPadreId(padreId);
    }
    public java.util.Map<Caracteristica, java.util.List<Caracteristica>> caracteristicasJerarquicasCompletas() {
        List<Caracteristica> todas = caracteristicaRepository.findAll();

        java.util.Map<Caracteristica, java.util.List<Caracteristica>> resultado = new java.util.LinkedHashMap<>();

        for (Caracteristica c : todas) {
            if (c.getIdPadre() == null) {
                java.util.List<Caracteristica> descendientes = new java.util.ArrayList<>();
                llenarDescendientes(c, todas, descendientes);
                resultado.put(c, descendientes);
            }
        }

        return resultado;
    }

    private void llenarDescendientes(Caracteristica padre,
                                     List<Caracteristica> todas,
                                     List<Caracteristica> acumulado) {
        for (Caracteristica c : todas) {
            if (c.getIdPadre() != null && c.getIdPadre().getId().equals(padre.getId())) {
                acumulado.add(c);
                llenarDescendientes(c, todas, acumulado);
            }
        }
    }


    public List<Caracteristica> rutaCaracteristica(Integer id) {

        List<Caracteristica> ruta = new ArrayList<>();

        Caracteristica actual = caracteristicaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Característica no encontrada"));

        while (actual != null) {
            ruta.add(0, actual);
            actual = actual.getIdPadre();
        }

        return ruta;
    }



    public List<NodoCaracteristica> caracteristicasEnArbol() {
        List<Caracteristica> todas = caracteristicaRepository.findAll();
        return construirNodos(null, todas);
    }

    private List<NodoCaracteristica> construirNodos(Integer padreId, List<Caracteristica> todas) {
        List<NodoCaracteristica> nodos = new ArrayList<>();

        for (Caracteristica c : todas) {
            Integer idPadreActual = (c.getIdPadre() == null) ? null : c.getIdPadre().getId();

            boolean esHijaDelPadreBuscado =
                    (padreId == null && idPadreActual == null) ||
                            (padreId != null && padreId.equals(idPadreActual));

            if (esHijaDelPadreBuscado) {
                NodoCaracteristica nodo = new NodoCaracteristica(c);
                nodo.setHijos(construirNodos(c.getId(), todas));
                nodos.add(nodo);
            }
        }

        return nodos;
    }
    public List<Puesto> puestosPorMesYAnio(Integer mes, Integer anio) {
        return puestoRepository.findByMesAndAnio(mes, anio);
    }

    public List<PuestoCaracteristica> puestoCaracteristicasFindByPuesto(int idPuesto) {
        return puestoCaracteristicaRepository.findByIdPuestoId(idPuesto);
    }
    public Optional<Oferente> oferenteFindById(Integer id) {
        return oferenteRepository.findById(id);
    }
}

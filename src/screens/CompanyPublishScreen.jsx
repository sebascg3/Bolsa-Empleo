import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api.js'

function CompanyPublishScreen({ token }) {
  const [tree, setTree] = useState([])
  const [currentNodes, setCurrentNodes] = useState([])
  const [route, setRoute] = useState([])
  const [published, setPublished] = useState({
    descripcion: '',
    salario: '',
    tipo: 'PUBLICO',
    activo: true,
  })
  const [selectedIds, setSelectedIds] = useState([])
  const [levels, setLevels] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true

    async function load() {
      try {
        setLoading(true)
        const treeData = await requestJSON('/public/caracteristicas-arbol')
        if (active) {
          const currentTree = treeData || []
          setTree(currentTree)
          setCurrentNodes(currentTree)
          setRoute([])
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error inesperado')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [token])

  function updatePublished(field, value) {
    setPublished((current) => ({ ...current, [field]: value }))
  }

  function enterNode(node) {
    setRoute((current) => [...current, node])
    setCurrentNodes(node.hijos || [])
  }

  function goToRoot() {
    setRoute([])
    setCurrentNodes(tree)
  }

  function goToRoute(index) {
    const nextRoute = route.slice(0, index + 1)
    const lastNode = nextRoute[nextRoute.length - 1]
    setRoute(nextRoute)
    setCurrentNodes(lastNode.hijos || [])
  }

  function toggleSelected(id) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id)
      }

      return [...current, id]
    })

    setLevels((current) => ({
      ...current,
      [id]: current[id] || 1,
    }))
  }

  function updateLevel(id, value) {
    setLevels((current) => ({
      ...current,
      [id]: Number(value),
    }))
  }

  function findNodeById(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node

      const found = findNodeById(node.hijos || [], id)
      if (found) return found
    }

    return null
  }

  function getSkillName(id) {
    const node = findNodeById(tree, id)
    return node?.nombre || `Característica ${id}`
  }

  async function publish(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = {
        descripcion: published.descripcion,
        salario: Number(published.salario),
        tipo: published.tipo,
        activo: Boolean(published.activo),
        caracteristicasSeleccionadas: selectedIds,
        niveles: levels,
      }

      await requestJSON('/empresa/puestos', {
        token,
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setSuccess('Puesto publicado correctamente.')
      setPublished({
        descripcion: '',
        salario: '',
        tipo: 'PUBLICO',
        activo: true,
      })
      setSelectedIds([])
      setLevels({})
      goToRoot()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
      <section className="page-section">
        {loading ? <p className="info-banner">Cargando características disponibles...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
        {success ? <p className="global-message">{success}</p> : null}

        <form onSubmit={publish}>
          <div className="content-card full-width">
            <div className="card-heading">
              <p className="eyebrow">Empresa</p>
              <h2>Publicar nuevo puesto</h2>
            </div>

            <div className="publish-form-grid">
              <label className="full-width floating-field">
                <span>Descripción del puesto</span>
                <textarea
                    rows="4"
                    value={published.descripcion}
                    onChange={(e) => updatePublished('descripcion', e.target.value)}
                    placeholder="Ej: Desarrollador Java con experiencia en Spring Boot..."
                    required
                />
              </label>

              <label className="floating-field">
                <span>Salario</span>
                <input
                    type="number"
                    step="0.01"
                    value={published.salario}
                    onChange={(e) => updatePublished('salario', e.target.value)}
                    placeholder="Ej: 850000"
                    required
                />
              </label>

              <label className="floating-field">
                <span>Visibilidad</span>
                <select
                    value={published.tipo}
                    onChange={(e) => updatePublished('tipo', e.target.value)}
                >
                  <option value="PUBLICO">Público</option>
                  <option value="PRIVADO">Privado</option>
                </select>
              </label>

              <label className="active-toggle full-width">
                <input
                    type="checkbox"
                    checked={published.activo}
                    onChange={(e) => updatePublished('activo', e.target.checked)}
                />
                <span>Publicar como puesto activo</span>
              </label>
            </div>
          </div>

          <div className="skills-layout">
            <div className="content-card">
              <div className="card-heading">
                <p className="eyebrow">Catálogo</p>
                <h2>Selecciona requisitos</h2>
              </div>

              <div className="skill-breadcrumb">
                <button type="button" onClick={goToRoot}>
                  Todas
                </button>

                {route.map((item, index) => (
                    <button key={item.id} type="button" onClick={() => goToRoute(index)}>
                      / {item.nombre}
                    </button>
                ))}
              </div>

              <div className="skills-selection-grid">
                {currentNodes.length > 0 ? (
                    currentNodes.map((item) => {
                      const selected = selectedIds.includes(item.id)
                      const hasChildren = item.hijos && item.hijos.length > 0

                      return (
                          <article key={item.id} className={selected ? 'skill-option is-selected' : 'skill-option'}>
                            <button
                                type="button"
                                className="skill-option-main"
                                onClick={() => toggleSelected(item.id)}
                            >
                              <strong>{item.nombre}</strong>
                              <span>{selected ? 'Requisito seleccionado' : 'Agregar requisito'}</span>
                            </button>

                            {hasChildren ? (
                                <button
                                    type="button"
                                    className="skill-option-next"
                                    onClick={() => enterNode(item)}
                                >
                                  Ver hijas ›
                                </button>
                            ) : null}
                          </article>
                      )
                    })
                ) : (
                    <p className="empty-state">Esta categoría no tiene más características.</p>
                )}
              </div>
            </div>

            <div className="content-card">
              <div className="card-heading">
                <p className="eyebrow">Niveles requeridos</p>
                <h2>Requisitos del puesto</h2>
              </div>

              <div className="selected-skills-panel">
                {selectedIds.length > 0 ? (
                    selectedIds.map((id) => (
                        <article key={id} className="selected-skill-card">
                          <div>
                            <strong>{getSkillName(id)}</strong>
                            <span>Nivel requerido: {levels[id] || 1}</span>
                          </div>

                          <label>
                            Nivel mínimo
                            <select
                                value={levels[id] || 1}
                                onChange={(e) => updateLevel(id, e.target.value)}
                            >
                              <option value="1">1 - Básico</option>
                              <option value="2">2 - Principiante</option>
                              <option value="3">3 - Intermedio</option>
                              <option value="4">4 - Avanzado</option>
                              <option value="5">5 - Experto</option>
                            </select>
                          </label>
                        </article>
                    ))
                ) : (
                    <p className="empty-state">Selecciona al menos una característica requerida.</p>
                )}
              </div>
            </div>
          </div>

          <div className="page-actions" style={{ marginTop: '18px' }}>
            <button className="primary-button" type="submit">
              Publicar puesto
            </button>
          </div>
        </form>
      </section>
  )
}

export default CompanyPublishScreen
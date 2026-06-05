import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api.js'

function OferenteSkillsScreen({ token }) {
  const [tree, setTree] = useState([])
  const [currentNodes, setCurrentNodes] = useState([])
  const [route, setRoute] = useState([])
  const [skills, setSkills] = useState([])
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

        const [skillsData, treeData] = await Promise.all([
          requestJSON('/oferente/habilidades', { token }),
          requestJSON('/public/caracteristicas-arbol'),
        ])

        if (active) {
          const currentSkills = skillsData || []
          const currentTree = treeData || []

          setSkills(currentSkills)
          setTree(currentTree)
          setCurrentNodes(currentTree)
          setRoute([])

          setSelectedIds([])

          setLevels({})
          setError('')
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Error inesperado')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [token])

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
    const savedSkill = skills.find((skill) => skill.id === id)

    return node?.nombre || savedSkill?.nombre || `Habilidad ${id}`
  }

  async function saveSkills(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const savedIds = skills.map((skill) => skill.id)

      const mergedIds = Array.from(new Set([...savedIds, ...selectedIds]))

      const mergedLevels = {}

      skills.forEach((skill) => {
        mergedLevels[skill.id] = skill.nivel || 1
      })

      Object.entries(levels).forEach(([id, nivel]) => {
        mergedLevels[id] = nivel
      })

      await requestJSON('/oferente/habilidades', {
        token,
        method: 'PUT',
        body: JSON.stringify({
          caracteristicasSeleccionadas: mergedIds,
          niveles: mergedLevels,
        }),
      })

      const updated = await requestJSON('/oferente/habilidades', { token })
      setSkills(updated || [])
      setSelectedIds([])
      setLevels({})
      setSuccess('Habilidades guardadas correctamente.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron guardar las habilidades')
    }
  }

  return (
      <section className="page-section">
        {loading ? <p className="info-banner">Cargando habilidades...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
        {success ? <p className="global-message">{success}</p> : null}

        <div className="content-card full-width">
          <div className="card-heading">

            <h2>Mis habilidades</h2>
          </div>

          <form onSubmit={saveSkills}>
            <div className="skills-layout">
              <div>
                <p className="eyebrow">Catálogo</p>
                <h3>Selecciona tus habilidades</h3>

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
                              <button type="button" className="skill-option-main" onClick={() => toggleSelected(item.id)}>
                                <strong>{item.nombre}</strong>
                                <span>{selected ? 'Seleccionada' : 'Agregar habilidad'}</span>
                              </button>

                              {hasChildren ? (
                                  <button type="button" className="skill-option-next" onClick={() => enterNode(item)}>
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

              <div>
                <p className="eyebrow">Niveles</p>
                <h3>Habilidades seleccionadas</h3>

                <div className="selected-skills-panel">
                  {selectedIds.length > 0 ? (
                      selectedIds.map((id) => (
                          <article key={id} className="selected-skill-card">
                            <div>
                              <strong>{getSkillName(id)}</strong>
                              <span>Nivel actual: {levels[id] || 1}</span>
                            </div>

                            <label>
                              Nivel
                              <select value={levels[id] || 1} onChange={(e) => updateLevel(id, e.target.value)}>
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
                      <p className="empty-state">Selecciona al menos una habilidad.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="page-actions" style={{ marginTop: '18px' }}>
              <button className="primary-button" type="submit">
                Guardar habilidades
              </button>
            </div>
          </form>
        </div>

        <div className="content-card full-width">
          <div className="card-heading">
            <p className="eyebrow">Perfil actual</p>
            <h2>Habilidades registradas</h2>
          </div>

          <div className="registered-skills-grid">
            {skills.length > 0 ? (
                skills.map((skill) => (
                    <article key={skill.id} className="registered-skill-card">
                      <strong>{skill.nombre}</strong>
                      <span>Nivel {skill.nivel}</span>
                    </article>
                ))
            ) : (
                <p className="empty-state">Todavía no tienes habilidades registradas.</p>
            )}
          </div>
        </div>
      </section>
  )
}

export default OferenteSkillsScreen
import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api'

function OferenteSkillsScreen({ token }) {
  const [tree, setTree] = useState([])
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
          setSkills(currentSkills)
          setTree(flattenTree(treeData || []))

          setSelectedIds(currentSkills.map((skill) => skill.id))

          const initialLevels = {}
          currentSkills.forEach((skill) => {
            initialLevels[skill.id] = skill.nivel || 1
          })

          setLevels(initialLevels)
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

  function flattenTree(nodes, route = []) {
    return nodes.flatMap((node) => {
      const currentRoute = [...route, node.nombre]

      return [
        {
          id: node.id,
          nombre: node.nombre,
          route: currentRoute.join(' / '),
        },
        ...flattenTree(node.hijos || [], currentRoute),
      ]
    })
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

  async function saveSkills(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      await requestJSON('/oferente/habilidades', {
        token,
        method: 'PUT',
        body: JSON.stringify({
          caracteristicasSeleccionadas: selectedIds,
          niveles: levels,
        }),
      })

      const updated = await requestJSON('/oferente/habilidades', { token })
      setSkills(updated || [])
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
            <p className="eyebrow">Oferente</p>
            <h2>Mis habilidades</h2>
          </div>

          <form onSubmit={saveSkills}>
            <div className="skills-layout">
              <div>
                <p className="eyebrow">Catálogo</p>
                <h3>Selecciona tus habilidades</h3>

                <div className="skills-selection-grid">
                  {tree.map((item) => {
                    const selected = selectedIds.includes(item.id)

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={selected ? 'skill-option is-selected' : 'skill-option'}
                            onClick={() => toggleSelected(item.id)}
                        >
                          <strong>{item.nombre}</strong>
                          <span>{item.route}</span>
                        </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="eyebrow">Niveles</p>
                <h3>Define tu dominio</h3>

                <div className="selected-skills-panel">
                  {selectedIds.length > 0 ? (
                      selectedIds.map((id) => {
                        const skill = tree.find((item) => item.id === id)

                        return (
                            <article key={id} className="selected-skill-card">
                              <div>
                                <strong>{skill?.nombre || `Habilidad ${id}`}</strong>
                                <span>{skill?.route}</span>
                              </div>

                              <label>
                                Nivel
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
                        )
                      })
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
      </section>
  )
}

export default OferenteSkillsScreen
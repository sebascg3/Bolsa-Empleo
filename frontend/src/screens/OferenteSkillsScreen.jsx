import { useEffect, useState } from 'react'
import CharacteristicTree from '../components/CharacteristicTree'
import { requestJSON } from '../lib/api'

function OferenteSkillsScreen({ token, onNavigate }) {
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
          setSkills(skillsData || [])
          setTree(treeData || [])
          setSelectedIds((skillsData || []).map((skill) => skill.id))
          const initialLevels = {}
          ;(skillsData || []).forEach((skill) => {
            initialLevels[skill.id] = skill.nivel || 1
          })
          setLevels(initialLevels)
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

  function toggleSelected(id) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
    setLevels((current) => ({ ...current, [id]: current[id] || 1 }))
  }

  async function saveSkills(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    try {
      await requestJSON('/oferente/habilidades', {
        token,
        method: 'PUT',
        body: JSON.stringify({ caracteristicasSeleccionadas: selectedIds, niveles: levels }),
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
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Oferente</p>
          <h1>Mis habilidades</h1>
          <p className="lead">Edita las características y niveles que te representan para que las empresas te encuentren más rápido.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('oferente-cv')}>
              Ir a mi CV
            </button>
            <button className="secondary-button" onClick={() => onNavigate('oferente')}>
              Panel de oferente
            </button>
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Edición guiada</p>
          <div className="hero-steps">
            <article>
              <strong>Seleccionar</strong>
              <span>Marca las habilidades que sí dominas.</span>
            </article>
            <article>
              <strong>Niveles</strong>
              <span>Asigna un nivel del 1 al 5 según tu experiencia.</span>
            </article>
            <article>
              <strong>Guardar</strong>
              <span>Actualiza tu perfil y mantén tu búsqueda de empleo al día.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Habilidades</span><strong>{String(skills.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Seleccionadas</span><strong>{String(selectedIds.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Estado</span><strong>{success ? 'Guardado' : 'Pendiente'}</strong></article>
      </div>

      {loading ? <p className="info-banner">Cargando habilidades...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="content-card full-width">
        <p className="eyebrow">Editar habilidades</p>
        <h2>Selecciona y asigna niveles</h2>
        <form onSubmit={saveSkills}>
          <CharacteristicTree nodes={tree} selectedIds={selectedIds} onToggle={toggleSelected} />

          {selectedIds.length > 0 ? (
            <div className="detail-list" style={{ marginTop: '16px' }}>
              {selectedIds.map((id) => (
                <div key={id} className="detail-item">
                  <strong>ID {id}</strong>
                  <label>
                    Nivel
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={levels[id] || 1}
                      onChange={(e) => setLevels((current) => ({ ...current, [id]: Number(e.target.value) }))}
                    />
                  </label>
                </div>
              ))}
            </div>
          ) : null}

          <div className="page-actions" style={{ marginTop: '18px' }}>
            <button className="primary-button" type="submit">Guardar habilidades</button>
          </div>
        </form>

        <div className="card-grid" style={{ marginTop: '18px' }}>
          {skills.map((skill) => (
            <article key={skill.id} className="skill-card">
              <strong>{skill.nombre}</strong>
              <span>Nivel {skill.nivel}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OferenteSkillsScreen


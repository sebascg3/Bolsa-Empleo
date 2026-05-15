import { useEffect, useState } from 'react'
import CharacteristicTree from '../components/CharacteristicTree'
import { requestJSON } from '../lib/api'

function OferenteScreen({ token, onNavigate }) {
  const [tree, setTree] = useState([])
  const [skills, setSkills] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [levels, setLevels] = useState({})
  const [cv, setCv] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true
    async function load() {
      try {
        setLoading(true)
        const [skillsData, treeData, cvData] = await Promise.all([
          requestJSON('/oferente/habilidades', { token }),
          requestJSON('/public/caracteristicas-arbol'),
          requestJSON('/oferente/cv', { token }),
        ])
        if (active) {
          setSkills(skillsData || [])
          setTree(treeData || [])
          setCv(cvData || '')
          setSelectedIds(skillsData.map((skill) => skill.id))
          const initialLevels = {}
          skillsData.forEach((skill) => {
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
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
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

  async function uploadCv(event) {
    event.preventDefault()
    if (!file) {
      setError('Debes seleccionar un PDF.')
      return
    }
    try {
      const data = new FormData()
      data.append('cv', file)
      const uploaded = await requestJSON('/oferente/cv', { token, method: 'POST', body: data })
      setCv(uploaded)
      setSuccess('CV cargado correctamente.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el CV')
    }
  }

  async function deleteCv() {
    try {
      await requestJSON('/oferente/cv', { token, method: 'DELETE' })
      setCv('')
      setSuccess('CV eliminado.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el CV')
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Oferente</p>
          <h1>Perfil, CV y habilidades</h1>
          <p className="lead">
            Actualiza tu hoja de vida, selecciona tus destrezas y visualiza cómo te comparan las
            empresas frente a los puestos disponibles.
          </p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <button className="secondary-button" onClick={() => onNavigate('search')}>Buscar puestos</button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Estado del perfil</p>
          <div className="hero-steps">
            <article>
              <strong>CV</strong>
              <span>{cv || 'Sin archivo cargado'}</span>
            </article>
            <article>
              <strong>Habilidades</strong>
              <span>{skills.length} características registradas</span>
            </article>
            <article>
              <strong>Compatibilidad</strong>
              <span>Mejora tu nivel para aparecer en más búsquedas.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>CV</span><strong>{cv ? 'Cargado' : 'Pendiente'}</strong></article>
        <article className="metric-card"><span>Habilidades</span><strong>{String(skills.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Seleccionadas</span><strong>{String(selectedIds.length).padStart(2, '0')}</strong></article>
      </div>

      {loading ? <p className="info-banner">Cargando perfil de oferente...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="dashboard-layout">
        <div className="content-card full-width">
          <p className="eyebrow">CV</p>
          <h2>Archivo actual</h2>
          <p>{cv || 'No hay CV cargado'}</p>
          <form className="auth-form" onSubmit={uploadCv}>
            <input type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="page-actions">
              <button className="primary-button" type="submit">Cargar CV</button>
              <button className="secondary-button" type="button" onClick={deleteCv}>Eliminar CV</button>
            </div>
          </form>
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Habilidades</p>
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
      </div>
    </section>
  )
}

export default OferenteScreen


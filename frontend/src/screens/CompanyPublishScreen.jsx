import { useEffect, useState } from 'react'
import CharacteristicTree from '../components/CharacteristicTree'
import { requestJSON } from '../lib/api'

function CompanyPublishScreen({ token, onNavigate }) {
  const [tree, setTree] = useState([])
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
          setTree(treeData || [])
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

  function toggleSelected(id) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
    setLevels((current) => ({ ...current, [id]: current[id] || 1 }))
  }

  function updatePublished(field, value) {
    setPublished((current) => ({ ...current, [field]: value }))
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
      setPublished({ descripcion: '', salario: '', tipo: 'PUBLICO', activo: true })
      setSelectedIds([])
      setLevels({})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Empresa</p>
          <h1>Publicar nuevo puesto</h1>
          <p className="lead">Crea una vacante nueva con salario, tipo y características requeridas desde una pantalla dedicada.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('empresa-jobs')}>
              Ver mis puestos
            </button>
            <button className="secondary-button" onClick={() => onNavigate('empresa')}>
              Panel de empresa
            </button>
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Publicación guiada</p>
          <div className="hero-steps">
            <article>
              <strong>Detalles</strong>
              <span>Escribe una descripción clara y define el salario.</span>
            </article>
            <article>
              <strong>Visibilidad</strong>
              <span>Elige si la vacante será pública o privada.</span>
            </article>
            <article>
              <strong>Características</strong>
              <span>Selecciona las habilidades necesarias y el nivel mínimo.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Seleccionadas</span><strong>{String(selectedIds.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Catálogo</span><strong>{String(tree.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Estado</span><strong>{success ? 'Publicado' : 'Pendiente'}</strong></article>
      </div>

      {loading ? <p className="info-banner">Cargando características disponibles...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="content-card full-width">
        <p className="eyebrow">Nuevo puesto</p>
        <h2>Completa la información y selecciona los requisitos</h2>
        <form className="auth-form" onSubmit={publish}>
          <label>
            Descripción
            <textarea rows="4" value={published.descripcion} onChange={(e) => updatePublished('descripcion', e.target.value)} required />
          </label>
          <label>
            Salario
            <input type="number" step="0.01" value={published.salario} onChange={(e) => updatePublished('salario', e.target.value)} required />
          </label>
          <label>
            Tipo
            <select value={published.tipo} onChange={(e) => updatePublished('tipo', e.target.value)}>
              <option value="PUBLICO">PUBLICO</option>
              <option value="PRIVADO">PRIVADO</option>
            </select>
          </label>
          <label className="tree-node" style={{ width: 'fit-content' }}>
            <input type="checkbox" checked={published.activo} onChange={(e) => updatePublished('activo', e.target.checked)} />
            <span>Activo</span>
          </label>

          <div className="card-heading">
            <p className="eyebrow">Características requeridas</p>
            <h3>Selecciona habilidades y niveles</h3>
          </div>
          <CharacteristicTree nodes={tree} selectedIds={selectedIds} onToggle={toggleSelected} />

          {selectedIds.length > 0 ? (
            <div className="detail-list">
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

          <div className="page-actions">
            <button className="primary-button" type="submit">Publicar</button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CompanyPublishScreen


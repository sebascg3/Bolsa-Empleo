import { useEffect, useState } from 'react'
import CharacteristicTree from '../components/CharacteristicTree'
import { requestJSON } from '../lib/api'

function AdminCharacteristicsScreen({ token, onNavigate }) {
  const [tree, setTree] = useState([])
  const [characteristicForm, setCharacteristicForm] = useState({ nombre: '', padreId: '' })
  const [detailId, setDetailId] = useState('')
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true
    async function load() {
      try {
        setLoading(true)
        const treeData = await requestJSON('/admin/caracteristicas', { token })
        if (active) {
          setTree(treeData || [])
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

  async function createCharacteristic(event) {
    event.preventDefault()
    try {
      const data = new FormData()
      data.append('nombre', characteristicForm.nombre)
      if (characteristicForm.padreId.trim()) {
        data.append('padreId', characteristicForm.padreId.trim())
      }
      await requestJSON('/admin/caracteristicas', {
        token,
        method: 'POST',
        body: data,
      })
      setSuccess('Característica creada correctamente.')
      setCharacteristicForm({ nombre: '', padreId: '' })
      const treeData = await requestJSON('/admin/caracteristicas', { token })
      setTree(treeData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la característica')
    }
  }

  async function loadDetail(event) {
    event.preventDefault()
    if (!detailId) return
    try {
      const data = await requestJSON(`/admin/caracteristicas/${detailId}`, { token })
      setDetail(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el detalle')
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Administrador</p>
          <h1>Características</h1>
          <p className="lead">Gestiona el árbol de habilidades y el detalle de cada característica en una pantalla dedicada.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('admin')}>
              Panel de administrador
            </button>
            <button className="secondary-button" onClick={() => onNavigate('admin-reports')}>
              Reportes
            </button>
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Catálogo jerárquico</p>
          <div className="hero-steps">
            <article>
              <strong>Árbol</strong>
              <span>Consulta la estructura actual antes de agregar una nueva característica.</span>
            </article>
            <article>
              <strong>Crear</strong>
              <span>Añade una habilidad madre o hija con su padre correspondiente.</span>
            </article>
            <article>
              <strong>Detalle</strong>
              <span>Abre el detalle de un nodo para ver ruta y descendientes.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Árbol</span><strong>{String(tree.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Detalle</span><strong>{detail ? 'Abierto' : 'Cerrado'}</strong></article>
        <article className="metric-card"><span>Estado</span><strong>{success ? 'Actualizado' : 'Listo'}</strong></article>
      </div>

      {loading ? <p className="info-banner">Cargando características...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="content-card full-width">
        <p className="eyebrow">Características</p>
        <h2>Árbol actual</h2>
        <CharacteristicTree nodes={tree} selectedIds={[]} onToggle={() => {}} />
      </div>

      <div className="content-card full-width">
        <p className="eyebrow">Crear característica</p>
        <h2>Nueva entrada del catálogo</h2>
        <form className="auth-form" onSubmit={createCharacteristic}>
          <label>
            Nombre
            <input
              name="nombre"
              value={characteristicForm.nombre}
              onChange={(e) => setCharacteristicForm((current) => ({ ...current, nombre: e.target.value }))}
              required
            />
          </label>
          <label>
            Padre ID
            <input
              name="padreId"
              value={characteristicForm.padreId}
              onChange={(e) => setCharacteristicForm((current) => ({ ...current, padreId: e.target.value }))}
            />
          </label>
          <div className="page-actions">
            <button className="primary-button" type="submit">Guardar característica</button>
          </div>
        </form>
      </div>

      <div className="content-card full-width">
        <p className="eyebrow">Detalle de característica</p>
        <form className="page-actions" onSubmit={loadDetail}>
          <input value={detailId} onChange={(e) => setDetailId(e.target.value)} placeholder="ID de característica" />
          <button className="primary-button" type="submit">Ver detalle</button>
        </form>
        {detail ? (
          <div className="detail-list" style={{ marginTop: '16px' }}>
            <article className="detail-item">
              <strong>{detail.current.nombre}</strong>
              <span>ID: {detail.current.id}</span>
              <span>Padre: {detail.current.padreId ?? 'N/A'}</span>
            </article>
            <article className="detail-item">
              <strong>Ruta</strong>
              <span>{detail.route.map((item) => item.nombre).join(' / ')}</span>
            </article>
            <article className="detail-item">
              <strong>Hijas</strong>
              <span>{detail.children.map((item) => item.nombre).join(', ') || 'No tiene'}</span>
            </article>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default AdminCharacteristicsScreen


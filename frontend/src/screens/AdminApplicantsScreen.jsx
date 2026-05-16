import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api'

function AdminApplicantsScreen({ token, onNavigate }) {
  const [pendingApplicants, setPendingApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true
    async function load() {
      try {
        setLoading(true)
        const applicantsData = await requestJSON('/admin/oferentes-pendientes', { token })
        if (active) {
          setPendingApplicants(applicantsData || [])
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

  async function approveApplicant(id) {
    try {
      await requestJSON(`/admin/oferentes/${id}/aprobar`, { token, method: 'POST' })
      setPendingApplicants((current) => current.filter((item) => item.id !== id))
      setSuccess('Oferente aprobado correctamente.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aprobar el oferente')
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Administrador</p>
          <h1>Oferentes pendientes</h1>
          <p className="lead">Revisa a las personas registradas y habilítalas desde una pantalla separada y sencilla.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('admin')}>
              Panel de administrador
            </button>
            <button className="secondary-button" onClick={() => onNavigate('admin-companies')}>
              Empresas pendientes
            </button>
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Flujo de aprobación</p>
          <div className="hero-steps">
            <article>
              <strong>Verificar</strong>
              <span>Confirma los datos de contacto y registro.</span>
            </article>
            <article>
              <strong>Aprobar</strong>
              <span>Habilita su acceso cuando el registro esté completo.</span>
            </article>
            <article>
              <strong>Continuar</strong>
              <span>Después puedes pasar a características o reportes.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Pendientes</span><strong>{String(pendingApplicants.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Acción</span><strong>Aprobar</strong></article>
        <article className="metric-card"><span>Estado</span><strong>{success ? 'Actualizado' : 'Listo'}</strong></article>
      </div>

      {loading ? <p className="info-banner">Cargando oferentes pendientes...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="content-card full-width">
        <p className="eyebrow">Oferentes por aprobar</p>
        <h2>{pendingApplicants.length} solicitudes</h2>
        <div className="detail-list">
          {pendingApplicants.map((item) => (
            <article key={item.id} className="detail-item">
              <strong>{item.nombre}</strong>
              <span>{item.correo}</span>
              <small>{item.detalle}</small>
              <button className="secondary-button" type="button" onClick={() => approveApplicant(item.id)}>
                Aprobar
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdminApplicantsScreen


import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api'

function AdminCompaniesScreen({ token, onNavigate }) {
  const [pendingCompanies, setPendingCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true
    async function load() {
      try {
        setLoading(true)
        const companiesData = await requestJSON('/admin/empresas-pendientes', { token })
        if (active) {
          setPendingCompanies(companiesData || [])
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

  async function approveCompany(id) {
    try {
      await requestJSON(`/admin/empresas/${id}/aprobar`, { token, method: 'POST' })
      setPendingCompanies((current) => current.filter((item) => item.id !== id))
      setSuccess('Empresa aprobada correctamente.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aprobar la empresa')
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Administrador</p>
          <h1>Empresas pendientes</h1>
          <p className="lead">Aprueba los registros empresariales antes de que puedan entrar al sistema y publicar puestos.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('admin')}>
              Panel de administrador
            </button>
            <button className="secondary-button" onClick={() => onNavigate('admin-applicants')}>
              Oferentes pendientes
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
              <span>Revisa el correo y el detalle de cada solicitud.</span>
            </article>
            <article>
              <strong>Aprobar</strong>
              <span>Confirma las empresas válidas para habilitar su acceso.</span>
            </article>
            <article>
              <strong>Continuar</strong>
              <span>Pasa al siguiente módulo cuando termines esta lista.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Pendientes</span><strong>{String(pendingCompanies.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Acción</span><strong>Aprobar</strong></article>
        <article className="metric-card"><span>Estado</span><strong>{success ? 'Actualizado' : 'Listo'}</strong></article>
      </div>

      {loading ? <p className="info-banner">Cargando empresas pendientes...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="content-card full-width">
        <p className="eyebrow">Empresas por aprobar</p>
        <h2>{pendingCompanies.length} solicitudes</h2>
        <div className="detail-list">
          {pendingCompanies.map((item) => (
            <article key={item.id} className="detail-item">
              <strong>{item.nombre}</strong>
              <span>{item.correo}</span>
              <small>{item.detalle}</small>
              <button className="secondary-button" type="button" onClick={() => approveCompany(item.id)}>
                Aprobar
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdminCompaniesScreen


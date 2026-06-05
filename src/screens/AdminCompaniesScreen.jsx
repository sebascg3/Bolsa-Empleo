import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api.js'

function AdminCompaniesScreen({ token }) {
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
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aprobar la empresa')
    }
  }

  return (
      <section className="page-section">
        {loading ? <p className="info-banner">Cargando empresas pendientes...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
        {success ? <p className="global-message">{success}</p> : null}

        <div className="content-card full-width">


          <div className="pending-grid">
            {pendingCompanies.map((item) => (
                <article key={item.id} className="pending-card">
                  <div>
                    <p className="eyebrow">Solicitud empresarial</p>
                    <h3>{item.nombre}</h3>
                    <div className="pending-info">
  <span>
    <strong>Correo:</strong> {item.correo}
  </span>
                      <span>
    <strong>Detalle:</strong> {item.detalle || 'Sin detalle registrado'}
  </span>
                    </div>
                  </div>

                  <button
                      className="approve-button"
                      type="button"
                      onClick={() => approveCompany(item.id)}
                  >
                    Aprobar empresa
                  </button>
                </article>
            ))}
          </div>

          {!loading && pendingCompanies.length === 0 ? (
              <p className="empty-state">No hay empresas pendientes por aprobar.</p>
          ) : null}
        </div>
      </section>
  )
}

export default AdminCompaniesScreen
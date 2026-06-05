import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api.js'

function AdminApplicantsScreen({ token }) {
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
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aprobar el oferente')
    }
  }

  return (
      <section className="page-section">
        {loading ? <p className="info-banner">Cargando oferentes pendientes...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
        {success ? <p className="global-message">{success}</p> : null}

        <div className="content-card full-width">


          <div className="pending-grid">
            {pendingApplicants.map((item) => (
                <article key={item.id} className="pending-card">
                  <div>
                    <p className="eyebrow">Solicitud de oferente</p>
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
                      onClick={() => approveApplicant(item.id)}
                  >
                    Aprobar oferente
                  </button>
                </article>
            ))}
          </div>

          {!loading && pendingApplicants.length === 0 ? (
              <p className="empty-state">No hay oferentes pendientes por aprobar.</p>
          ) : null}
        </div>
      </section>
  )
}

export default AdminApplicantsScreen
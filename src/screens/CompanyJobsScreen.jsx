import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard.jsx'
import { requestJSON } from '../lib/api.js'

function CompanyJobsScreen({ token, onNavigate }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  async function toggleJobType(id) {
    try {
      const updated = await requestJSON(`/empresa/puestos/${id}/tipo`, {
        token,
        method: 'PATCH',
      })

      setJobs((current) =>
          current.map((job) => (job.id === id ? updated : job)),
      )

      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la visibilidad del puesto')
    }
  }
  useEffect(() => {
    if (!token) return

    let active = true

    async function load() {
      try {
        setLoading(true)
        const jobsData = await requestJSON('/empresa/puestos', { token })
        if (active) {
          setJobs(jobsData || [])
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

  async function toggleJob(id) {
    try {
      await requestJSON(`/empresa/puestos/${id}/toggle`, { token, method: 'PATCH' })
      setJobs((current) =>
          current.map((job) => (job.id === id ? { ...job, activo: !job.activo } : job)),
      )
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar el estado del puesto')
    }
  }

  return (
      <section className="page-section">
        {loading ? <p className="info-banner">Cargando puestos de empresa...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}

        <div className="content-card full-width">
          <div className="card-heading">
            <p className="eyebrow">Empresa</p>
            <h2>Mis puestos publicados</h2>
          </div>

          <div className="card-grid">
            {jobs.map((job) => (
                <article key={job.id} className="company-job-card">
                  <JobCard job={job} />

                  <div className="company-job-actions">
                    <button
                        className={job.activo ? 'danger-button' : 'approve-button'}
                        type="button"
                        onClick={() => toggleJob(job.id)}
                    >
                      {job.activo ? 'Desactivar puesto' : 'Activar puesto'}
                    </button>

                    <button
                        className={`visibility-button ${
                            job.tipo === 'PUBLICO' ? 'private' : ''
                        }`}
                        type="button"
                        onClick={() => toggleJobType(job.id)}
                    >
                      {job.tipo === 'PUBLICO'
                          ? 'Hacer privado'
                          : 'Hacer público'}
                    </button>

                    <button
                        className="primary-button"
                        type="button"
                        onClick={() => onNavigate(`/empresa/puestos/${job.id}/candidatos`)}
                    >
                      Ver candidatos
                    </button>
                  </div>
                </article>
            ))}
          </div>

          {!loading && jobs.length === 0 ? (
              <p className="empty-state">Todavía no tienes puestos publicados.</p>
          ) : null}
        </div>
      </section>
  )
}

export default CompanyJobsScreen
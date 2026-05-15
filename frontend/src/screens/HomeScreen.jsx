import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api'
import JobCard from '../components/JobCard'

function HomeScreen({ onNavigate, token }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setLoading(true)
        const data = await requestJSON('/public/puestos-recientes', { token })
        if (active) {
          setJobs(Array.isArray(data) ? data : [])
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error inesperado')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [token])

  return (
    <section className="page-section">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Pantalla pública</p>
          <h1>Encuentra y publica oportunidades</h1>
          <p className="lead">
            Esta pantalla ya es React puro y consume la API del backend usando `fetch`.
          </p>
        </div>
        <div className="page-actions">
          <button className="primary-button" onClick={() => onNavigate('search')}>
            Buscar puestos
          </button>
          <button className="secondary-button" onClick={() => onNavigate('login')}>
            Iniciar sesión
          </button>
          <button className="secondary-button" onClick={() => onNavigate('register-oferente')}>
            Registrarme como oferente
          </button>
          <button className="secondary-button" onClick={() => onNavigate('register-empresa')}>
            Registrarme como empresa
          </button>
        </div>
      </div>

      {loading ? <p className="info-banner">Cargando puestos recientes...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      <div className="card-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {!loading && jobs.length === 0 ? (
        <p className="empty-state">Todavía no hay puestos publicados.</p>
      ) : null}
    </section>
  )
}

export default HomeScreen


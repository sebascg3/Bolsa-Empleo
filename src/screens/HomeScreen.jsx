import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api.js'
import JobCard from '../components/JobCard.jsx'

function HomeScreen({ token }) {
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
        {loading ? <p className="info-banner">Cargando puestos recientes...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}

        <div className="section-intro">
          <div>
            <p className="eyebrow">Lo más reciente</p>
            <h2>Puestos públicos destacados</h2>
          </div>

        </div>

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
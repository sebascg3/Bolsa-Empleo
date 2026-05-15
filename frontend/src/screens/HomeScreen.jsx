import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api'
import JobCard from '../components/JobCard'

function HomeScreen({ onNavigate, token }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const quickFacts = [
    { label: 'Puestos recientes', value: String(jobs.length).padStart(2, '0') },
    { label: 'Acceso', value: token ? 'Sesión activa' : 'Público' },
    { label: 'Búsqueda', value: 'Por características' },
  ]

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
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Pantalla pública</p>
          <h1>Encuentra talento o publica vacantes en minutos</h1>
          <p className="lead">
            La plataforma conecta empresas y oferentes con una experiencia clara: explora puestos,
            busca por habilidades, registra tu perfil y accede con JWT cuando tu cuenta sea aprobada.
          </p>

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

        <aside className="hero-panel">
          <p className="eyebrow">Cómo funciona</p>
          <div className="hero-steps">
            <article>
              <strong>1. Regístrate</strong>
              <span>Empresas y oferentes crean su cuenta desde la parte pública.</span>
            </article>
            <article>
              <strong>2. Espera aprobación</strong>
              <span>El administrador valida nuevas cuentas antes del acceso completo.</span>
            </article>
            <article>
              <strong>3. Explora y conecta</strong>
              <span>Publica puestos, filtra coincidencias y revisa perfiles compatibles.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        {quickFacts.map((fact) => (
          <article key={fact.label} className="metric-card">
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </article>
        ))}
      </div>

      {loading ? <p className="info-banner">Cargando puestos recientes...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      <div className="section-intro">
        <div>
          <p className="eyebrow">Lo más reciente</p>
          <h2>Puestos públicos destacados</h2>
        </div>
        <p>
          Pasa el cursor sobre cada tarjeta para ver sus características requeridas y revisar el
          nivel de compatibilidad en un vistazo.
        </p>
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


import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard'
import { requestJSON } from '../lib/api'

function DashboardScreen({ token, user, onNavigate, onLogout }) {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true

    async function load() {
      try {
        setLoading(true)
        const data = await requestJSON('/dashboard', { token })
        if (active) {
          setDashboard(data)
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

  if (!token) {
    return (
      <section className="page-section">
        <div className="content-card">
          <p className="eyebrow">Zona privada</p>
          <h1>Necesitas iniciar sesión</h1>
          <p className="lead">El dashboard usa JWT y carga la información según el rol del usuario.</p>
          <button className="primary-button" onClick={() => onNavigate('login')}>
            Ir al login
          </button>
        </div>
      </section>
    )
  }

  const role = dashboard?.role || user?.rol || 'USUARIO'

  return (
    <section className="page-section">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{user?.nombre || dashboard?.user?.nombre || 'Usuario autenticado'}</h1>
          <p className="lead">
            Vista cargada desde `/api/dashboard` según el rol <strong>{role}</strong>.
          </p>
        </div>
        <div className="page-actions">
          <button className="secondary-button" onClick={() => onNavigate('home')}>
            Inicio público
          </button>
          {role === 'EMPRESA' ? (
            <button className="secondary-button" onClick={() => onNavigate('empresa')}>
              Pantalla de empresa
            </button>
          ) : null}
          {role === 'OFERENTE' ? (
            <button className="secondary-button" onClick={() => onNavigate('oferente')}>
              Pantalla de oferente
            </button>
          ) : null}
          {role === 'ADMIN' ? (
            <button className="secondary-button" onClick={() => onNavigate('admin')}>
              Pantalla de admin
            </button>
          ) : null}
          <button className="secondary-button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {loading ? <p className="info-banner">Cargando dashboard...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {dashboard ? (
        <div className="dashboard-layout">
          <div className="content-card">
            <div className="card-heading">
              <p className="eyebrow">Información de sesión</p>
              <h2>{dashboard.user.nombre}</h2>
            </div>
            <dl className="stats-grid">
              <div>
                <dt>Correo</dt>
                <dd>{dashboard.user.correo}</dd>
              </div>
              <div>
                <dt>Rol</dt>
                <dd>{dashboard.user.rol}</dd>
              </div>
              <div>
                <dt>ID</dt>
                <dd>{dashboard.user.id}</dd>
              </div>
            </dl>
          </div>

          {role === 'ADMIN' ? (
            <>
              <div className="content-card">
                <p className="eyebrow">Pendientes</p>
                <h2>Empresas por aprobar: {dashboard.pendingEmpresas.length}</h2>
                <div className="detail-list">
                  {dashboard.pendingEmpresas.map((item) => (
                    <article key={`empresa-${item.id}`} className="detail-item">
                      <strong>{item.nombre}</strong>
                      <span>{item.correo}</span>
                      <small>{item.detalle}</small>
                    </article>
                  ))}
                </div>
              </div>

              <div className="content-card">
                <p className="eyebrow">Pendientes</p>
                <h2>Oferentes por aprobar: {dashboard.pendingOferentes.length}</h2>
                <div className="detail-list">
                  {dashboard.pendingOferentes.map((item) => (
                    <article key={`oferente-${item.id}`} className="detail-item">
                      <strong>{item.nombre}</strong>
                      <span>{item.correo}</span>
                      <small>{item.detalle}</small>
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {role === 'EMPRESA' ? (
            <div className="content-card full-width">
              <p className="eyebrow">Mis publicaciones</p>
              <h2>{dashboard.myJobs.length} puestos publicados</h2>
              <div className="card-grid">
                {dashboard.myJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          ) : null}

          {role === 'OFERENTE' ? (
            <div className="content-card full-width">
              <p className="eyebrow">Mis habilidades</p>
              <h2>{dashboard.skills.length} características registradas</h2>
              <div className="skill-grid">
                {dashboard.skills.map((skill) => (
                  <article key={skill.id} className="skill-card">
                    <strong>{skill.nombre}</strong>
                    <span>Nivel {skill.nivel}</span>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <div className="content-card full-width">
            <p className="eyebrow">Puestos recientes</p>
            <h2>Últimos puestos publicados</h2>
            <div className="card-grid">
              {dashboard.recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default DashboardScreen


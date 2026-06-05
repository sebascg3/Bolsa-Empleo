import { useEffect, useState } from 'react'
import RouteCards from '../components/RouteCards.jsx'
import { requestJSON } from '../lib/api.js'

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
  const summaryCards = dashboard
    ? role === 'ADMIN'
      ? [
          { label: 'Rol', value: role },
          { label: 'Empresas', value: String(dashboard.pendingEmpresas?.length || 0).padStart(2, '0') },
          { label: 'Oferentes', value: String(dashboard.pendingOferentes?.length || 0).padStart(2, '0') },
        ]
      : role === 'EMPRESA'
        ? [
            { label: 'Rol', value: role },
            { label: 'Puestos', value: String(dashboard.myJobs?.length || 0).padStart(2, '0') },
            { label: 'Recientes', value: String(dashboard.recentJobs?.length || 0).padStart(2, '0') },
          ]
        : [
            { label: 'Rol', value: role },
            { label: 'Habilidades', value: String(dashboard.skills?.length || 0).padStart(2, '0') },
            { label: 'CV', value: dashboard.cv ? 'Cargado' : 'Pendiente' },
          ]
    : []

  const quickActions = role === 'ADMIN'
    ? [
        {
          key: 'admin-companies',
          eyebrow: 'Administración',
          title: 'Empresas pendientes',
          description: 'Aprueba o rechaza las empresas antes de que publiquen puestos.',
          cta: 'Abrir empresas pendientes',
          path: 'admin-companies',
        },
        {
          key: 'admin-applicants',
          eyebrow: 'Administración',
          title: 'Oferentes pendientes',
          description: 'Revisa a las personas registradas antes de habilitar su acceso completo.',
          cta: 'Abrir oferentes pendientes',
          path: 'admin-applicants',
        },
        {
          key: 'admin-characteristics',
          eyebrow: 'Catálogo',
          title: 'Características',
          description: 'Administra el árbol de habilidades y categorías del sistema.',
          cta: 'Abrir características',
          path: 'admin-characteristics',
        },
        {
          key: 'admin-reports',
          eyebrow: 'Informes',
          title: 'Reportes',
          description: 'Consulta los reportes de puestos por mes y año.',
          cta: 'Abrir reportes',
          path: 'admin-reports',
        },
      ]
    : role === 'EMPRESA'
      ? [
          {
            key: 'empresa-jobs',
            eyebrow: 'Empresa',
            title: 'Ver mis puestos',
            description: 'Consulta tus vacantes publicadas, actívalas o desactívalas y revisa candidatos.',
            cta: 'Ir a mis puestos',
            path: 'empresa-jobs',
          },
          {
            key: 'empresa-publish',
            eyebrow: 'Empresa',
            title: 'Publicar nuevo puesto',
            description: 'Crea una nueva vacante con salario, tipo y características requeridas.',
            cta: 'Publicar puesto',
            path: 'empresa-publish',
          },
        ]
      : role === 'OFERENTE'
        ? [
            {
              key: 'oferente-skills',
              eyebrow: 'Oferente',
              title: 'Mis habilidades',
              description: 'Edita las características y niveles que te representan.',
              cta: 'Ir a habilidades',
              path: 'oferente-skills',
            },
            {
              key: 'oferente-cv',
              eyebrow: 'Oferente',
              title: 'Mi CV',
              description: 'Carga o elimina tu hoja de vida PDF desde una pantalla dedicada.',
              cta: 'Ir a mi CV',
              path: 'oferente-cv',
            },
          ]
        : []

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Dashboard</p>
          <h1>{user?.nombre || dashboard?.user?.nombre || 'Usuario autenticado'}</h1>
          <p className="lead">
            Vista cargada desde `/api/dashboard` según el rol <strong>{role}</strong>.
          </p>

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

        <aside className="hero-panel">
          <p className="eyebrow">Resumen rápido</p>
          <div className="hero-steps">
            <article>
              <strong>Sesión segura</strong>
              <span>Todo el acceso se realiza con JWT y permisos por rol.</span>
            </article>
            <article>
              <strong>Atajos</strong>
              <span>Usa el panel superior para moverte entre tus pantallas principales.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        {summaryCards.map((card) => (
          <article key={card.label} className="metric-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      {loading ? <p className="info-banner">Cargando dashboard...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {dashboard ? (
        <div className="dashboard-layout">
          <div className="content-card full-width">
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

          <div className="content-card full-width">
            <div className="section-intro">
              <div>
                <p className="eyebrow">Accesos directos</p>
                <h2>{role === 'ADMIN' ? 'Elige el módulo que quieres administrar' : role === 'EMPRESA' ? 'Administra tus vacantes' : role === 'OFERENTE' ? 'Gestiona tu perfil' : 'Accesos disponibles'}</h2>
              </div>
              <p>
                Las secciones grandes se movieron a pantallas separadas para que cada flujo sea más claro y rápido de usar.
              </p>
            </div>
            <RouteCards items={quickActions} onNavigate={onNavigate} />
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default DashboardScreen


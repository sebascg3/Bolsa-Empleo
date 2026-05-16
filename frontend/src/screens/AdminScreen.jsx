import RouteCards from '../components/RouteCards'

function AdminScreen({ onNavigate }) {
  const shortcuts = [
    {
      key: 'admin-companies',
      eyebrow: 'Administrador',
      title: 'Empresas pendientes',
      description: 'Aprobación de registros empresariales antes de habilitar sus publicaciones.',
      cta: 'Abrir empresas pendientes',
      path: 'admin-companies',
    },
    {
      key: 'admin-applicants',
      eyebrow: 'Administrador',
      title: 'Oferentes pendientes',
      description: 'Revisión de personas registradas para habilitar su acceso al sistema.',
      cta: 'Abrir oferentes pendientes',
      path: 'admin-applicants',
    },
    {
      key: 'admin-characteristics',
      eyebrow: 'Catálogo',
      title: 'Características',
      description: 'Gestiona el árbol de habilidades y categorías del sistema.',
      cta: 'Abrir características',
      path: 'admin-characteristics',
    },
    {
      key: 'admin-reports',
      eyebrow: 'Informes',
      title: 'Reportes',
      description: 'Consulta los reportes de puestos por mes y año en una vista dedicada.',
      cta: 'Abrir reportes',
      path: 'admin-reports',
    },
  ]

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Administrador</p>
          <h1>Panel de acceso de administrador</h1>
          <p className="lead">Desde aquí entras a cada módulo separado: aprobaciones, catálogo y reportes.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <button className="secondary-button" onClick={() => onNavigate('home')}>Inicio</button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Tareas clave</p>
          <div className="hero-steps">
            <article>
              <strong>Aprobar</strong>
              <span>Empresas y oferentes nuevos antes de que entren al sistema.</span>
            </article>
            <article>
              <strong>Catalogar</strong>
              <span>Agrega características madre e hijas para publicar vacantes.</span>
            </article>
            <article>
              <strong>Analizar</strong>
              <span>Consulta reportes de puestos para una visión rápida del mes.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Accesos</span><strong>04</strong></article>
        <article className="metric-card"><span>Flujos</span><strong>01</strong></article>
        <article className="metric-card"><span>Estado</span><strong>Listo</strong></article>
      </div>

      <div className="content-card full-width">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Navegación</p>
            <h2>Elige el módulo que quieres administrar</h2>
          </div>
          <p>Los apartados de aprobaciones, catálogo y reportes ahora viven en pantallas separadas.</p>
        </div>
        <RouteCards items={shortcuts} onNavigate={onNavigate} />
      </div>
    </section>
  )
}

export default AdminScreen


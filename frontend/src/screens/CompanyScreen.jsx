import RouteCards from '../components/RouteCards'

function CompanyScreen({ onNavigate }) {
  const shortcuts = [
    {
      key: 'empresa-jobs',
      eyebrow: 'Empresa',
      title: 'Ver mis puestos',
      description: 'Consulta tus vacantes activas e inactivas, cambia su estado y revisa candidatos.',
      cta: 'Abrir puestos',
      path: 'empresa-jobs',
    },
    {
      key: 'empresa-publish',
      eyebrow: 'Empresa',
      title: 'Publicar nuevo puesto',
      description: 'Crea una vacante nueva con salario, visibilidad y características requeridas.',
      cta: 'Crear puesto',
      path: 'empresa-publish',
    },
  ]

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Empresa</p>
          <h1>Panel de acceso de empresa</h1>
          <p className="lead">Desde aquí eliges si quieres revisar tus puestos publicados o crear una vacante nueva.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
            <button className="secondary-button" onClick={() => onNavigate('home')}>
              Inicio
            </button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Panel de empresa</p>
          <div className="hero-steps">
            <article>
              <strong>Publicaciones</strong>
              <span>Controla puestos públicos y privados desde un solo lugar.</span>
            </article>
            <article>
              <strong>Candidatos</strong>
              <span>Busca perfiles compatibles con las características requeridas.</span>
            </article>
            <article>
              <strong>CV</strong>
              <span>Revisa el currículo PDF de cada candidato desde el detalle.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Accesos</span><strong>02</strong></article>
        <article className="metric-card"><span>Flujos</span><strong>01</strong></article>
        <article className="metric-card"><span>Estado</span><strong>Listo</strong></article>
      </div>

      <div className="content-card full-width">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Navegación</p>
            <h2>Elige el área que quieres gestionar</h2>
          </div>
          <p>Cada botón te lleva a una pantalla más específica para que el flujo sea más claro.</p>
        </div>
        <RouteCards items={shortcuts} onNavigate={onNavigate} />
      </div>
    </section>
  )
}

export default CompanyScreen


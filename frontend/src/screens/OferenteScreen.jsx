import RouteCards from '../components/RouteCards'

function OferenteScreen({ onNavigate }) {
  const shortcuts = [
    {
      key: 'oferente-skills',
      eyebrow: 'Oferente',
      title: 'Mis habilidades',
      description: 'Abre la pantalla para editar tus destrezas y niveles por característica.',
      cta: 'Abrir habilidades',
      path: 'oferente-skills',
    },
    {
      key: 'oferente-cv',
      eyebrow: 'Oferente',
      title: 'Mi CV',
      description: 'Gestiona tu archivo PDF en una pantalla dedicada y fácil de usar.',
      cta: 'Abrir CV',
      path: 'oferente-cv',
    },
  ]

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Oferente</p>
          <h1>Panel de acceso de oferente</h1>
          <p className="lead">Elige si quieres editar tus habilidades o administrar tu CV desde pantallas separadas.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <button className="secondary-button" onClick={() => onNavigate('search')}>Buscar puestos</button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Estado del perfil</p>
          <div className="hero-steps">
            <article>
              <strong>CV</strong>
              <span>Gestiona tu archivo PDF desde la pantalla de CV.</span>
            </article>
            <article>
              <strong>Habilidades</strong>
              <span>Administra tus destrezas desde la pantalla de habilidades.</span>
            </article>
            <article>
              <strong>Compatibilidad</strong>
              <span>Mejora tu nivel para aparecer en más búsquedas.</span>
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
            <h2>Selecciona qué quieres administrar</h2>
          </div>
          <p>Las tareas se dividieron para que tu perfil sea más claro y rápido de actualizar.</p>
        </div>
        <RouteCards items={shortcuts} onNavigate={onNavigate} />
      </div>
    </section>
  )
}

export default OferenteScreen


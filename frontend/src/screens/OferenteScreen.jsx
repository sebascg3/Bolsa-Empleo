import RouteCards from '../components/RouteCards'

function OferenteScreen({ onNavigate }) {
  const shortcuts = [
    {
      key: 'oferente-skills',
      eyebrow: '',
      title: 'Mis habilidades',
      description: 'Edita tus destrezas y niveles por característica.',
      cta: 'Abrir habilidades',
      path: 'oferente-skills',
    },
    {
      key: 'oferente-cv',
      eyebrow: '',
      title: 'Mi CV',
      description: 'Gestiona tu archivo PDF de currículo.',
      cta: 'Abrir CV',
      path: 'oferente-cv',
    },
  ]

  return (
      <section className="page-section">
        <div className="content-card full-width">
          <div className="section-intro">

          </div>

          <RouteCards items={shortcuts} onNavigate={onNavigate} />
        </div>
      </section>
  )
}

export default OferenteScreen
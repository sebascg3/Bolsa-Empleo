import RouteCards from '../components/RouteCards.jsx'

function CompanyScreen({ onNavigate }) {
  const shortcuts = [
    {
      key: 'empresa-jobs',
      eyebrow: 'Empresa',
      title: 'Ver mis puestos',
      description: 'Consulta tus vacantes, cambia su estado y revisa candidatos compatibles.',
      cta: 'Abrir puestos',
      path: 'empresa-jobs',
    },
    {
      key: 'empresa-publish',
      eyebrow: 'Empresa',
      title: 'Publicar nuevo puesto',
      description: 'Crea una nueva vacante con salario, visibilidad y características requeridas.',
      cta: 'Crear puesto',
      path: 'empresa-publish',
    },
  ]

  return (
      <section className="page-section">
        <div className="content-card full-width">
          <RouteCards items={shortcuts} onNavigate={onNavigate} />
        </div>
      </section>
  )
}

export default CompanyScreen
import RouteCards from '../components/RouteCards.jsx'

function AdminScreen({ onNavigate }) {
  const shortcuts = [
    {
      key: 'admin-companies',
      eyebrow: '',
      title: 'Empresas pendientes',
      description: 'Aprobación de registros empresariales antes de habilitar sus publicaciones.',
      cta: 'Abrir empresas pendientes',
      path: 'admin-companies',
    },
    {
      key: 'admin-applicants',
      eyebrow: '',
      title: 'Oferentes pendientes',
      description: 'Revisión de personas registradas para habilitar su acceso al sistema.',
      cta: 'Abrir oferentes pendientes',
      path: 'admin-applicants',
    },
    {
      key: 'admin-characteristics',
      eyebrow: '',
      title: 'Características',
      description: 'Gestiona el árbol de habilidades de puestos de trabajo y oferentes del sistema.                                                                          ',
      cta: 'Abrir características',
      path: 'admin-characteristics',
    },
    {
      key: 'admin-reports',
      eyebrow: '',
      title: 'Reportes',
      description: 'Consulta los reportes de puestos por mes y año en una vista dedicada.',
      cta: 'Abrir reportes',
      path: 'admin-reports',
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

export default AdminScreen


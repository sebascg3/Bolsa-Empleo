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
        <div className="content-card full-width">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Administrador</p>
              <h2>Panel de administración</h2>
            </div>
          </div>

          <RouteCards items={shortcuts} onNavigate={onNavigate} />
        </div>
      </section>
  )
}

export default AdminScreen


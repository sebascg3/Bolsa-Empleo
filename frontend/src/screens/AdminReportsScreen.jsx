import { useState } from 'react'
import JobCard from '../components/JobCard'
import { requestJSON } from '../lib/api'

function AdminReportsScreen({ token, onNavigate }) {
  const [report, setReport] = useState(null)
  const [reportForm, setReportForm] = useState({ mes: String(new Date().getMonth() + 1), anio: String(new Date().getFullYear()) })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadReport(event) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams(reportForm)
      const data = await requestJSON(`/admin/reportes/puestos?${params.toString()}`, { token })
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Administrador</p>
          <h1>Reportes</h1>
          <p className="lead">Consulta el reporte de puestos por mes y año desde una pantalla dedicada para análisis.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('admin')}>
              Panel de administrador
            </button>
            <button className="secondary-button" onClick={() => onNavigate('admin-characteristics')}>
              Características
            </button>
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Consulta guiada</p>
          <div className="hero-steps">
            <article>
              <strong>Filtrar</strong>
              <span>Elige el mes y el año que quieres revisar.</span>
            </article>
            <article>
              <strong>Cargar</strong>
              <span>Recupera el reporte de puestos con un solo botón.</span>
            </article>
            <article>
              <strong>Analizar</strong>
              <span>Visualiza cada puesto con las tarjetas existentes.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Reporte</span><strong>{report ? String(report.total).padStart(2, '0') : '00'}</strong></article>
        <article className="metric-card"><span>Mes</span><strong>{reportForm.mes.padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Estado</span><strong>{loading ? 'Cargando' : 'Listo'}</strong></article>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      <div className="content-card full-width">
        <p className="eyebrow">Reporte de puestos</p>
        <h2>Filtra y consulta el resultado</h2>
        <form className="page-actions" onSubmit={loadReport}>
          <input value={reportForm.mes} onChange={(e) => setReportForm((current) => ({ ...current, mes: e.target.value }))} placeholder="Mes" />
          <input value={reportForm.anio} onChange={(e) => setReportForm((current) => ({ ...current, anio: e.target.value }))} placeholder="Año" />
          <button className="primary-button" type="submit">Cargar</button>
        </form>
        {report ? (
          <>
            <p className="global-message">Total: {report.total}</p>
            <div className="card-grid">
              {report.puestos.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

export default AdminReportsScreen


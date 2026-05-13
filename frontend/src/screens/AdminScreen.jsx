import { useEffect, useState } from 'react'
import CharacteristicTree from '../components/CharacteristicTree'
import JobCard from '../components/JobCard'
import { requestJSON } from '../lib/api'

function AdminScreen({ token, onNavigate }) {
  const [tree, setTree] = useState([])
  const [pendingCompanies, setPendingCompanies] = useState([])
  const [pendingApplicants, setPendingApplicants] = useState([])
  const [report, setReport] = useState(null)
  const [detail, setDetail] = useState(null)
  const [characteristicForm, setCharacteristicForm] = useState({ nombre: '', padreId: '' })
  const [detailId, setDetailId] = useState('')
  const [reportForm, setReportForm] = useState({ mes: String(new Date().getMonth() + 1), anio: String(new Date().getFullYear()) })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true
    async function load() {
      try {
        setLoading(true)
        const [treeData, companiesData, applicantsData] = await Promise.all([
          requestJSON('/admin/caracteristicas', { token }),
          requestJSON('/admin/empresas-pendientes', { token }),
          requestJSON('/admin/oferentes-pendientes', { token }),
        ])
        if (active) {
          setTree(treeData || [])
          setPendingCompanies(companiesData || [])
          setPendingApplicants(applicantsData || [])
          setError('')
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Error inesperado')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [token])

  async function createCharacteristic(event) {
    event.preventDefault()
    try {
      const data = new FormData()
      data.append('nombre', characteristicForm.nombre)
      if (characteristicForm.padreId.trim()) {
        data.append('padreId', characteristicForm.padreId.trim())
      }
      await requestJSON('/admin/caracteristicas', {
        token,
        method: 'POST',
        body: data,
      })
      setSuccess('Característica creada correctamente.')
      setCharacteristicForm({ nombre: '', padreId: '' })
      const treeData = await requestJSON('/admin/caracteristicas', { token })
      setTree(treeData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la característica')
    }
  }

  async function approveCompany(id) {
    await requestJSON(`/admin/empresas/${id}/aprobar`, { token, method: 'POST' })
    setPendingCompanies((current) => current.filter((item) => item.id !== id))
  }

  async function approveApplicant(id) {
    await requestJSON(`/admin/oferentes/${id}/aprobar`, { token, method: 'POST' })
    setPendingApplicants((current) => current.filter((item) => item.id !== id))
  }

  async function loadDetail(event) {
    event.preventDefault()
    if (!detailId) return
    try {
      const data = await requestJSON(`/admin/caracteristicas/${detailId}`, { token })
      setDetail(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el detalle')
    }
  }

  async function loadReport(event) {
    event.preventDefault()
    try {
      const params = new URLSearchParams(reportForm)
      const data = await requestJSON(`/admin/reportes/puestos?${params.toString()}`, { token })
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte')
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Administrador</p>
          <h1>Control de catálogo y aprobaciones</h1>
          <p className="lead">Pantalla React que reemplaza `Caracteristicas`, `EmpresasPendientes`, `OferentesPendientes` y `Reportes`.</p>
        </div>
        <div className="page-actions">
          <button className="secondary-button" onClick={() => onNavigate('dashboard')}>Dashboard</button>
          <button className="secondary-button" onClick={() => onNavigate('home')}>Inicio</button>
        </div>
      </div>

      {loading ? <p className="info-banner">Cargando panel de administración...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="dashboard-layout">
        <div className="content-card full-width">
          <p className="eyebrow">Características</p>
          <h2>Árbol actual</h2>
          <CharacteristicTree nodes={tree} selectedIds={[]} onToggle={() => {}} />
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Crear característica</p>
          <form className="auth-form" onSubmit={createCharacteristic}>
            <label>
              Nombre
              <input
                name="nombre"
                value={characteristicForm.nombre}
                onChange={(e) => setCharacteristicForm((current) => ({ ...current, nombre: e.target.value }))}
                required
              />
            </label>
            <label>
              Padre ID
              <input
                name="padreId"
                value={characteristicForm.padreId}
                onChange={(e) => setCharacteristicForm((current) => ({ ...current, padreId: e.target.value }))}
              />
            </label>
            <div className="page-actions">
              <button className="primary-button" type="submit">Guardar característica</button>
            </div>
          </form>
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Detalle de característica</p>
          <form className="page-actions" onSubmit={loadDetail}>
            <input value={detailId} onChange={(e) => setDetailId(e.target.value)} placeholder="ID de característica" />
            <button className="primary-button" type="submit">Ver detalle</button>
          </form>
          {detail ? (
            <div className="detail-list" style={{ marginTop: '16px' }}>
              <article className="detail-item">
                <strong>{detail.current.nombre}</strong>
                <span>ID: {detail.current.id}</span>
                <span>Padre: {detail.current.padreId ?? 'N/A'}</span>
              </article>
              <article className="detail-item">
                <strong>Ruta</strong>
                <span>{detail.route.map((item) => item.nombre).join(' / ')}</span>
              </article>
              <article className="detail-item">
                <strong>Hijas</strong>
                <span>{detail.children.map((item) => item.nombre).join(', ') || 'No tiene'}</span>
              </article>
            </div>
          ) : null}
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Empresas por aprobar</p>
          <div className="detail-list">
            {pendingCompanies.map((item) => (
              <article key={item.id} className="detail-item">
                <strong>{item.nombre}</strong>
                <span>{item.correo}</span>
                <small>{item.detalle}</small>
                <button className="secondary-button" type="button" onClick={() => approveCompany(item.id)}>
                  Aprobar
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Oferentes por aprobar</p>
          <div className="detail-list">
            {pendingApplicants.map((item) => (
              <article key={item.id} className="detail-item">
                <strong>{item.nombre}</strong>
                <span>{item.correo}</span>
                <small>{item.detalle}</small>
                <button className="secondary-button" type="button" onClick={() => approveApplicant(item.id)}>
                  Aprobar
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Reporte de puestos</p>
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
      </div>
    </section>
  )
}

export default AdminScreen


import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import JobCard from '../components/JobCard.jsx'
import { requestJSON } from '../lib/api.js'

function AdminReportsScreen({ token }) {
  const [report, setReport] = useState(null)
  const [reportForm, setReportForm] = useState({
    mes: String(new Date().getMonth() + 1),
    anio: String(new Date().getFullYear()),
  })
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

  function exportPdf() {
    if (!report) return

    const doc = new jsPDF()
    const monthName = getMonthName(reportForm.mes)

    doc.setFontSize(16)
    doc.text('Reporte de Puestos', 14, 18)

    doc.setFontSize(11)
    doc.text(`Mes: ${monthName}`, 14, 28)
    doc.text(`Año: ${reportForm.anio}`, 14, 35)
    doc.text(`Total de puestos: ${report.total}`, 14, 42)

    autoTable(doc, {
      startY: 50,
      head: [['Empresa', 'Puesto', 'Fecha', 'Salario', 'Tipo', 'Requisitos']],
      body: report.puestos.map((job) => [
        job.empresa || 'N/D',
        job.descripcion || 'N/D',
        job.fecha || 'N/D',
        job.salario ?? 'N/D',
        job.tipo || 'N/D',
        job.requisitos?.length || 0,
      ]),
    })

    doc.output('dataurlnewwindow')
  }

  function getMonthName(month) {
    const months = {
      1: 'Enero',
      2: 'Febrero',
      3: 'Marzo',
      4: 'Abril',
      5: 'Mayo',
      6: 'Junio',
      7: 'Julio',
      8: 'Agosto',
      9: 'Septiembre',
      10: 'Octubre',
      11: 'Noviembre',
      12: 'Diciembre',
    }

    return months[Number(month)] || month
  }

  return (
      <section className="page-section">
        {error ? <p className="error-banner">{error}</p> : null}

        <div className="content-card full-width">
          <div className="card-heading">
            <p className="eyebrow">Administrador</p>
            <h2>Reporte de puestos</h2>
          </div>

          <form className="report-filter-form" onSubmit={loadReport}>
            <div className="filter-field">
              <label>Mes</label>
              <select
                  value={reportForm.mes}
                  onChange={(e) =>
                      setReportForm((current) => ({
                        ...current,
                        mes: e.target.value,
                      }))
                  }
              >
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>

            <div className="filter-field">
              <label>Año</label>
              <input
                  type="number"
                  min="2020"
                  max="2100"
                  value={reportForm.anio}
                  onChange={(e) =>
                      setReportForm((current) => ({
                        ...current,
                        anio: e.target.value,
                      }))
                  }
              />
            </div>

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Generando...' : 'Generar reporte'}
            </button>

            <button
                className="secondary-button"
                type="button"
                onClick={exportPdf}
                disabled={!report}
            >
              Abrir PDF
            </button>
          </form>

          {report ? (
              <>
                <p className="global-message">Total de puestos encontrados: {report.total}</p>

                <div className="card-grid">
                  {report.puestos.map((job) => (
                      <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {report.puestos.length === 0 ? (
                    <p className="empty-state">No hay puestos registrados para ese mes y año.</p>
                ) : null}
              </>
          ) : null}
        </div>
      </section>
  )
}

export default AdminReportsScreen
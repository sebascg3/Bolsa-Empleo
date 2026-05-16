import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard'
import { requestJSON } from '../lib/api'

function CompanyJobsScreen({ token, onNavigate }) {
  const [jobs, setJobs] = useState([])
  const [candidateSearchJobId, setCandidateSearchJobId] = useState('')
  const [candidateSearch, setCandidateSearch] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true
    async function load() {
      try {
        setLoading(true)
        const jobsData = await requestJSON('/empresa/puestos', { token })
        if (active) {
          setJobs(jobsData || [])
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error inesperado')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [token])

  async function toggleJob(id) {
    try {
      await requestJSON(`/empresa/puestos/${id}/toggle`, { token, method: 'PATCH' })
      setJobs((current) => current.map((job) => (job.id === id ? { ...job, activo: !job.activo } : job)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar el estado del puesto')
    }
  }

  async function searchCandidates(event) {
    event.preventDefault()
    if (!candidateSearchJobId) return
    try {
      const data = await requestJSON(`/empresa/puestos/${candidateSearchJobId}/candidatos`, { token })
      setCandidateSearch(data)
      setSelectedCandidate(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los candidatos')
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Empresa</p>
          <h1>Ver mis puestos</h1>
          <p className="lead">Consulta tus vacantes publicadas, cambia su estado y revisa candidatos desde esta pantalla.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('empresa')}>
              Panel de empresa
            </button>
            <button className="secondary-button" onClick={() => onNavigate('empresa-publish')}>
              Publicar nuevo puesto
            </button>
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Qué puedes hacer</p>
          <div className="hero-steps">
            <article>
              <strong>Activar / desactivar</strong>
              <span>Mantén el control de cada vacante sin entrar al backend.</span>
            </article>
            <article>
              <strong>Buscar candidatos</strong>
              <span>Filtra candidatos compatibles con el puesto seleccionado.</span>
            </article>
            <article>
              <strong>Detalle</strong>
              <span>Revisa la ficha completa del candidato antes de contactar.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Puestos</span><strong>{String(jobs.length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Activos</span><strong>{String(jobs.filter((job) => job.activo).length).padStart(2, '0')}</strong></article>
        <article className="metric-card"><span>Buscador</span><strong>{candidateSearch ? 'Abierto' : 'Listo'}</strong></article>
      </div>

      {loading ? <p className="info-banner">Cargando puestos de empresa...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      <div className="dashboard-layout">
        <div className="content-card full-width">
          <p className="eyebrow">Mis puestos</p>
          <h2>{jobs.length} publicaciones activas o inactivas</h2>
          <div className="card-grid">
            {jobs.map((job) => (
              <article key={job.id} className="job-card">
                <JobCard job={job} />
                <div className="page-actions" style={{ marginTop: '14px' }}>
                  <button className="secondary-button" type="button" onClick={() => toggleJob(job.id)}>
                    {job.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="secondary-button" type="button" onClick={() => setCandidateSearchJobId(String(job.id))}>
                    Buscar candidatos
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Buscar candidatos</p>
          <h2>Vista separada para candidatos por puesto</h2>
          <form className="page-actions" onSubmit={searchCandidates}>
            <select value={candidateSearchJobId} onChange={(e) => setCandidateSearchJobId(e.target.value)}>
              <option value="">Seleccione un puesto</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>{job.descripcion || `Puesto ${job.id}`}</option>
              ))}
            </select>
            <button className="primary-button" type="submit" disabled={jobs.length === 0}>Buscar</button>
          </form>

          {candidateSearch ? (
            <>
              <p className="global-message">
                Total requisitos: {candidateSearch.totalRequisitos} | Candidatos encontrados: {candidateSearch.candidatos.length}
              </p>
              <div className="card-grid">
                {candidateSearch.candidatos.map((candidate) => (
                  <article key={candidate.id} className="skill-card">
                    <strong>{candidate.nombre}{candidate.apellido ? ` ${candidate.apellido}` : ''}</strong>
                    <span>{candidate.correo}</span>
                    <small>{candidate.identificacion}</small>
                    <small>% compatibilidad: {candidate.porcentaje}</small>
                    <button className="secondary-button" type="button" onClick={() => setSelectedCandidate(candidate)}>
                      Ver detalle
                    </button>
                  </article>
                ))}
              </div>
            </>
          ) : null}

          {selectedCandidate ? (
            <div className="content-card" style={{ marginTop: '16px' }}>
              <h3>{selectedCandidate.nombre}{selectedCandidate.apellido ? ` ${selectedCandidate.apellido}` : ''}</h3>
              <p>{selectedCandidate.correo}</p>
              <p>Identificación: {selectedCandidate.identificacion}</p>
              <p>Nacionalidad: {selectedCandidate.nacionalidad || 'N/D'}</p>
              <p>Teléfono: {selectedCandidate.telefono || 'N/D'}</p>
              <p>Residencia: {selectedCandidate.residencia || 'N/D'}</p>
              <p>CV: {selectedCandidate.cv || 'No registrado'}</p>
              <h4>Habilidades</h4>
              <div className="skill-grid">
                {selectedCandidate.habilidades.map((skill) => (
                  <article key={skill.id} className="skill-card">
                    <strong>{skill.nombre}</strong>
                    <span>Nivel {skill.nivel}</span>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default CompanyJobsScreen


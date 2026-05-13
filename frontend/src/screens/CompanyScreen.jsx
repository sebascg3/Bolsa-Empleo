import { useEffect, useMemo, useState } from 'react'
import CharacteristicTree from '../components/CharacteristicTree'
import JobCard from '../components/JobCard'
import { requestJSON } from '../lib/api'

function CompanyScreen({ token, onNavigate }) {
  const [jobs, setJobs] = useState([])
  const [tree, setTree] = useState([])
  const [published, setPublished] = useState({
    descripcion: '',
    salario: '',
    tipo: 'PUBLICO',
    activo: true,
  })
  const [selectedIds, setSelectedIds] = useState([])
  const [levels, setLevels] = useState({})
  const [candidateSearchJobId, setCandidateSearchJobId] = useState('')
  const [candidateSearch, setCandidateSearch] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const hasJobs = useMemo(() => jobs.length > 0, [jobs])

  useEffect(() => {
    if (!token) return

    let active = true
    async function load() {
      try {
        setLoading(true)
        const [jobsData, treeData] = await Promise.all([
          requestJSON('/empresa/puestos', { token }),
          requestJSON('/public/caracteristicas-arbol'),
        ])
        if (active) {
          setJobs(jobsData || [])
          setTree(treeData || [])
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

  function toggleSelected(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
    setLevels((current) => ({ ...current, [id]: current[id] || 1 }))
  }

  function updatePublished(field, value) {
    setPublished((current) => ({ ...current, [field]: value }))
  }

  async function publish(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    try {
      const payload = {
        descripcion: published.descripcion,
        salario: Number(published.salario),
        tipo: published.tipo,
        activo: Boolean(published.activo),
        caracteristicasSeleccionadas: selectedIds,
        niveles: levels,
      }
      await requestJSON('/empresa/puestos', {
        token,
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setSuccess('Puesto publicado correctamente.')
      setPublished({ descripcion: '', salario: '', tipo: 'PUBLICO', activo: true })
      setSelectedIds([])
      setLevels({})
      const jobsData = await requestJSON('/empresa/puestos', { token })
      setJobs(jobsData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  async function toggleJob(id) {
    try {
      await requestJSON(`/empresa/puestos/${id}/toggle`, { token, method: 'PATCH' })
      setJobs((current) =>
        current.map((job) => (job.id === id ? { ...job, activo: !job.activo } : job)),
      )
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
      <div className="page-hero">
        <div>
          <p className="eyebrow">Empresa</p>
          <h1>Gestión de puestos y candidatos</h1>
          <p className="lead">Pantalla React que reemplaza el dashboard, publicar puesto y buscar candidatos.</p>
        </div>
        <div className="page-actions">
          <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
            Dashboard genérico
          </button>
          <button className="secondary-button" onClick={() => onNavigate('home')}>
            Inicio
          </button>
        </div>
      </div>

      {loading ? <p className="info-banner">Cargando información de empresa...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="dashboard-layout">
        <div className="content-card full-width">
          <p className="eyebrow">Mis puestos</p>
          <h2>{jobs.length} publicaciones activas o inactivas</h2>
          <div className="card-grid">
            {jobs.map((job) => (
              <article key={job.id} className="job-card">
                <JobCard job={job} />
                <div className="page-actions" style={{ marginTop: '14px' }}>
                  <button className="secondary-button" onClick={() => toggleJob(job.id)}>
                    {job.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="secondary-button" onClick={() => setCandidateSearchJobId(String(job.id))}>
                    Buscar candidatos
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Publicar puesto</p>
          <h2>Nuevo puesto</h2>
          <form className="auth-form" onSubmit={publish}>
            <label>
              Descripción
              <textarea rows="4" value={published.descripcion} onChange={(e) => updatePublished('descripcion', e.target.value)} required />
            </label>
            <label>
              Salario
              <input type="number" step="0.01" value={published.salario} onChange={(e) => updatePublished('salario', e.target.value)} required />
            </label>
            <label>
              Tipo
              <select value={published.tipo} onChange={(e) => updatePublished('tipo', e.target.value)}>
                <option value="PUBLICO">PUBLICO</option>
                <option value="PRIVADO">PRIVADO</option>
              </select>
            </label>
            <label className="tree-node" style={{ width: 'fit-content' }}>
              <input type="checkbox" checked={published.activo} onChange={(e) => updatePublished('activo', e.target.checked)} />
              <span>Activo</span>
            </label>

            <div className="card-heading">
              <p className="eyebrow">Características requeridas</p>
              <h3>Selecciona habilidades y niveles</h3>
            </div>
            <CharacteristicTree nodes={tree} selectedIds={selectedIds} onToggle={toggleSelected} />

            {selectedIds.length > 0 ? (
              <div className="detail-list">
                {selectedIds.map((id) => (
                  <div key={id} className="detail-item">
                    <strong>ID {id}</strong>
                    <label>
                      Nivel
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={levels[id] || 1}
                        onChange={(e) => setLevels((current) => ({ ...current, [id]: Number(e.target.value) }))}
                      />
                    </label>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="page-actions">
              <button className="primary-button" type="submit">Publicar</button>
            </div>
          </form>
        </div>

        <div className="content-card full-width">
          <p className="eyebrow">Buscar candidatos</p>
          <h2>Vista equivalente a `BuscarCandidatos` y `VerDetalleCandidato`</h2>
          <form className="page-actions" onSubmit={searchCandidates}>
            <select value={candidateSearchJobId} onChange={(e) => setCandidateSearchJobId(e.target.value)}>
              <option value="">Seleccione un puesto</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>{job.descripcion || `Puesto ${job.id}`}</option>
              ))}
            </select>
            <button className="primary-button" type="submit" disabled={!hasJobs}>Buscar</button>
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

export default CompanyScreen


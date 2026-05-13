import { useEffect, useState } from 'react'
import CharacteristicTree from '../components/CharacteristicTree'
import JobCard from '../components/JobCard'
import { requestJSON } from '../lib/api'

function SearchScreen({ token }) {
  const [tree, setTree] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setLoading(true)
        const data = await requestJSON('/public/buscar', { token })
        if (active) {
          setTree(data.arbolCaracteristicas || [])
          setJobs(data.puestos || [])
          setSelectedIds(data.seleccionadas || [])
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error inesperado')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  function toggleSelected(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  async function loadResults(nextSelectedIds = selectedIds) {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      nextSelectedIds.forEach((id) => params.append('caracteristicas', String(id)))
      const suffix = params.toString() ? `?${params.toString()}` : ''
      const data = await requestJSON(`/public/buscar${suffix}`, { token })
      setTree(data.arbolCaracteristicas || [])
      setJobs(data.puestos || [])
      setSelectedIds(data.seleccionadas || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  async function search(event) {
    event.preventDefault()
    await loadResults(selectedIds)
  }

  function clearFilters() {
    setSelectedIds([])
    void loadResults([])
  }

  return (
    <section className="page-section">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Búsqueda pública</p>
          <h1>Filtra puestos por características</h1>
          <p className="lead">
            Esta pantalla migra la búsqueda tradicional a React y actualiza los resultados sin
            recargar la página.
          </p>
        </div>
        <div className="page-actions">
          <button className="primary-button" onClick={search}>
            Buscar
          </button>
          <button className="secondary-button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>

      {loading ? <p className="info-banner">Cargando características y resultados...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      <div className="search-layout">
        <aside className="content-card search-panel">
          <div className="card-heading">
            <p className="eyebrow">Características</p>
            <h2>Selecciona una o varias</h2>
          </div>
          <form onSubmit={search}>
            <CharacteristicTree nodes={tree} selectedIds={selectedIds} onToggle={toggleSelected} />
          </form>
        </aside>

        <div className="content-card">
          <div className="card-heading">
            <p className="eyebrow">Resultados</p>
            <h2>Puestos encontrados</h2>
          </div>
          <div className="card-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {!loading && jobs.length === 0 ? (
            <p className="empty-state">No se encontraron puestos con ese filtro.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default SearchScreen


import { useEffect, useState } from 'react'
import { requestJSON, requestText } from '../lib/api'

function OferenteCvScreen({ token, onNavigate }) {
  const [cv, setCv] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true
    async function load() {
      try {
        setLoading(true)
        const cvData = await requestText('/oferente/cv', { token })
        if (active) {
          setCv(cvData || '')
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

  async function uploadCv(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!file) {
      setError('Debes seleccionar un PDF.')
      return
    }
    try {
      const data = new FormData()
      data.append('cv', file)
      const uploaded = await requestText('/oferente/cv', { token, method: 'POST', body: data })
      setCv(uploaded)
      setSuccess('CV cargado correctamente.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el CV')
    }
  }

  async function deleteCv() {
    try {
      await requestJSON('/oferente/cv', { token, method: 'DELETE' })
      setCv('')
      setSuccess('CV eliminado.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el CV')
    }
  }

  return (
    <section className="page-section">
      <div className="page-hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Oferente</p>
          <h1>Mi CV</h1>
          <p className="lead">Gestiona tu hoja de vida PDF en una pantalla clara, sin mezclarla con el resto del perfil.</p>

          <div className="page-actions">
            <button className="secondary-button" onClick={() => onNavigate('oferente-skills')}>
              Ir a mis habilidades
            </button>
            <button className="secondary-button" onClick={() => onNavigate('oferente')}>
              Panel de oferente
            </button>
            <button className="secondary-button" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Gestión de archivo</p>
          <div className="hero-steps">
            <article>
              <strong>Subir</strong>
              <span>Selecciona un PDF actualizado con tu experiencia.</span>
            </article>
            <article>
              <strong>Revisar</strong>
              <span>Verifica el archivo cargado antes de compartirlo con empresas.</span>
            </article>
            <article>
              <strong>Eliminar</strong>
              <span>Si necesitas cambiarlo, borra el anterior y sube el nuevo.</span>
            </article>
          </div>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>CV</span><strong>{cv ? 'Cargado' : 'Pendiente'}</strong></article>
        <article className="metric-card"><span>Archivo</span><strong>{cv || 'N/D'}</strong></article>
        <article className="metric-card"><span>Estado</span><strong>{success ? 'Actualizado' : 'Pendiente'}</strong></article>
      </div>

      {loading ? <p className="info-banner">Cargando CV...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {success ? <p className="global-message">{success}</p> : null}

      <div className="content-card full-width">
        <p className="eyebrow">CV</p>
        <h2>Archivo actual</h2>
        <p>{cv || 'No hay CV cargado'}</p>
        <form className="auth-form" onSubmit={uploadCv}>
          <input type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="page-actions">
            <button className="primary-button" type="submit">Cargar CV</button>
            <button className="secondary-button" type="button" onClick={deleteCv}>Eliminar CV</button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default OferenteCvScreen


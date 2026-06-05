import { useEffect, useState } from 'react'
import { requestJSON, requestText } from '../lib/api.js'

function OferenteCvScreen({ token }) {
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

      const uploaded = await requestText('/oferente/cv', {
        token,
        method: 'POST',
        body: data,
      })

      setCv(uploaded)
      setFile(null)
      setSuccess('CV cargado correctamente.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el CV')
    }
  }

  async function openCv() {
    if (!cv) {
      setError('No hay CV cargado.')
      return
    }

    try {
      setError('')

      const response = await fetch('/api/oferente/cv/archivo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('No se pudo abrir el CV.')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir el CV')
    }
  }

  async function deleteCv() {
    try {
      await requestJSON('/oferente/cv', { token, method: 'DELETE' })
      setCv('')
      setFile(null)
      setSuccess('CV eliminado.')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el CV')
    }
  }

  return (
      <section className="page-section">
        {loading ? <p className="info-banner">Cargando CV...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
        {success ? <p className="global-message">{success}</p> : null}

        <div className="content-card full-width">
          <div className="card-heading">
            <h2>Mi Currículum</h2>
          </div>

          <div className="cv-preview-card">
            <div>
              <strong>Estado</strong>
              <p>{cv ? 'CV cargado correctamente' : 'No hay CV cargado'}</p>
            </div>

            {cv ? (
                <span className="job-pill job-pill--state is-active">
    CV cargado
  </span>
            ) : (
                <span className="job-pill job-pill--state is-inactive">
    Sin archivo
  </span>
            )}
          </div>

          {cv ? (
              <div className="page-actions">
                <button className="primary-button" type="button" onClick={openCv}>
                  Ver CV
                </button>
              </div>
          ) : null}

          <form className="cv-form" onSubmit={uploadCv}>
            <label className="upload-area">
              <span>Seleccionar archivo PDF</span>
              <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="page-actions">
              <button className="upload-button" type="submit">
                {cv ? 'Cargar nuevo CV' : 'Cargar CV'}
              </button>

              <button
                  className="danger-button"
                  type="button"
                  onClick={deleteCv}
                  disabled={!cv}
              >
                Eliminar CV
              </button>
            </div>
          </form>
        </div>
      </section>
  )
}

export default OferenteCvScreen
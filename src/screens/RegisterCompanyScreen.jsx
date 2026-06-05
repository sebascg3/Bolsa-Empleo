import { useState } from 'react'
import { requestJSON } from '../lib/api.js'

function RegisterCompanyScreen({ onNavigate }) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    ubicacion: '',
    telefono: '',
    descripcion: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = new FormData()
      Object.entries(form).forEach(([key, value]) => data.append(key, value))

      const response = await requestJSON('/public/register/empresa', {
        method: 'POST',
        body: data,
      })

      setSuccess(response.message || 'Registro completado.')
      onNavigate('login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
      <section className="page-section auth-section">
        <div className="content-card auth-card">
          <div className="card-heading">
            <p className="eyebrow">Registro público</p>
            <h2>Crear cuenta de empresa</h2>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}
          {success ? <p className="global-message">{success}</p> : null}

          <form className="auth-form" onSubmit={submit}>
            <label>
              Nombre de la empresa <span className="required-field">*</span>
              <input
                  value={form.nombre}
                  onChange={(e) => update('nombre', e.target.value)}
                  required
              />
            </label>

            <label>
              Correo <span className="required-field">*</span>
              <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => update('correo', e.target.value)}
                  required
              />
            </label>

            <label>
              Contraseña <span className="required-field">*</span>
              <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
              />
            </label>

            <label>
              Ubicación
              <input
                  value={form.ubicacion}
                  onChange={(e) => update('ubicacion', e.target.value)}
              />
            </label>

            <label>
              Teléfono
              <input
                  value={form.telefono}
                  onChange={(e) => update('telefono', e.target.value)}
              />
            </label>

            <label className="full-width">
              Descripción
              <textarea
                  rows="4"
                  value={form.descripcion}
                  onChange={(e) => update('descripcion', e.target.value)}
              />
            </label>

            <div className="page-actions">
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar empresa'}
              </button>

              <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onNavigate('home')}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </section>
  )
}

export default RegisterCompanyScreen
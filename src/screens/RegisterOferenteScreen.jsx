import { useState } from 'react'
import { requestJSON } from '../lib/api.js'

function RegisterOferenteScreen({ onNavigate }) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    identificacion: '',
    nacionalidad: '',
    telefono: '',
    residencia: '',
  })
  const [cv, setCv] = useState(null)
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
      if (!cv) {
        throw new Error('Debes seleccionar un CV en PDF.')
      }
      data.append('cv', cv)

      const response = await requestJSON('/public/register/oferente', {
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
            <h2>Crear cuenta de oferente</h2>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}
          {success ? <p className="global-message">{success}</p> : null}

          <form className="auth-form" onSubmit={submit} encType="multipart/form-data">
            <label>
              Nombre completo <span className="required-field">*</span>
              <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)} required />
            </label>

            <label>
              Correo <span className="required-field">*</span>
              <input type="email" value={form.correo} onChange={(e) => update('correo', e.target.value)} required />
            </label>

            <label>
              Contraseña <span className="required-field">*</span>
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
            </label>

            <label>
              Identificación <span className="required-field">*</span>
              <input value={form.identificacion} onChange={(e) => update('identificacion', e.target.value)} required />
            </label>

            <label>
              Nacionalidad
              <input value={form.nacionalidad} onChange={(e) => update('nacionalidad', e.target.value)} />
            </label>

            <label>
              Teléfono
              <input value={form.telefono} onChange={(e) => update('telefono', e.target.value)} />
            </label>

            <label>
              Residencia
              <input value={form.residencia} onChange={(e) => update('residencia', e.target.value)} />
            </label>

            <label>
              CV en PDF <span className="required-field">*</span>
              <input type="file" accept="application/pdf,.pdf" onChange={(e) => setCv(e.target.files?.[0] || null)} required />
            </label>

            <div className="page-actions">
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar oferente'}
              </button>

              <button className="secondary-button" type="button" onClick={() => onNavigate('home')}>
                Volver
              </button>
            </div>
          </form>
        </div>
      </section>
  )
}

export default RegisterOferenteScreen


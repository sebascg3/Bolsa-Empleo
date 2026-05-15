import { useState } from 'react'
import { requestJSON } from '../lib/api'

function RegisterOferenteScreen({ onNavigate }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
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
      <div className="page-hero hero-split auth-hero">
        <div className="hero-copy">
          <p className="eyebrow">Registro público</p>
          <h1>Crear cuenta de oferente</h1>
          <p className="lead">
            Completa tu perfil profesional para que las empresas puedan encontrarte y comparar tus
            habilidades con los puestos disponibles.
          </p>

          <div className="hero-steps">
            <article>
              <strong>Perfil personal</strong>
              <span>Ingresa tu nombre, apellido, identificación y datos de contacto.</span>
            </article>
            <article>
              <strong>Currículo PDF</strong>
              <span>Sube tu hoja de vida para que las empresas puedan revisarte al detalle.</span>
            </article>
            <article>
              <strong>Habilidades</strong>
              <span>Luego podrás ajustar tus características y niveles desde tu panel.</span>
            </article>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Antes de empezar</p>
          <div className="checklist">
            <span>Identificación</span>
            <span>Correo válido</span>
            <span>Primer apellido</span>
            <span>CV en PDF</span>
          </div>
        </aside>
      </div>

      <div className="content-card auth-card">
        {error ? <p className="error-banner">{error}</p> : null}
        {success ? <p className="global-message">{success}</p> : null}

        <form className="auth-form" onSubmit={submit} encType="multipart/form-data">
          <label>
            Nombre completo
            <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)} required />
          </label>
          <label>
            Primer apellido
            <input value={form.apellido} onChange={(e) => update('apellido', e.target.value)} required />
          </label>
          <label>
            Correo
            <input type="email" value={form.correo} onChange={(e) => update('correo', e.target.value)} required />
          </label>
          <label>
            Contraseña
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
          </label>
          <label>
            Identificación
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
            CV en PDF
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


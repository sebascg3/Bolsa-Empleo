import { useState } from 'react'
import { requestJSON } from '../lib/api'

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
      <div className="page-hero hero-split auth-hero">
        <div className="hero-copy">
          <p className="eyebrow">Registro público</p>
          <h1>Crear cuenta de empresa</h1>
          <p className="lead">
            Registra tu organización para publicar puestos de trabajo y revisar candidatos una vez
            que el administrador apruebe tu acceso.
          </p>

          <div className="hero-steps">
            <article>
              <strong>Perfil corporativo</strong>
              <span>Captura nombre, ubicación, contacto y una breve descripción.</span>
            </article>
            <article>
              <strong>Validación</strong>
              <span>Tu solicitud quedará pendiente hasta que un administrador la apruebe.</span>
            </article>
            <article>
              <strong>Publica vacantes</strong>
              <span>Después podrás crear puestos públicos o privados desde tu panel.</span>
            </article>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Qué necesitas</p>
          <div className="checklist">
            <span>Nombre comercial</span>
            <span>Correo válido</span>
            <span>Contraseña segura</span>
            <span>Ubicación y teléfono</span>
          </div>
        </aside>
      </div>

      <div className="content-card auth-card">
        {error ? <p className="error-banner">{error}</p> : null}
        {success ? <p className="global-message">{success}</p> : null}

        <form className="auth-form" onSubmit={submit}>
          <label>
            Nombre de la empresa
            <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)} required />
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
            Ubicación
            <input value={form.ubicacion} onChange={(e) => update('ubicacion', e.target.value)} />
          </label>
          <label>
            Teléfono
            <input value={form.telefono} onChange={(e) => update('telefono', e.target.value)} />
          </label>
          <label>
            Descripción
            <textarea rows="4" value={form.descripcion} onChange={(e) => update('descripcion', e.target.value)} />
          </label>

          <div className="page-actions">
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar empresa'}
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

export default RegisterCompanyScreen


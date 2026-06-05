import { useState } from 'react'
import { requestJSON } from '../lib/api.js'

function LoginScreen({ onLoginSuccess, onNavigate }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await requestJSON('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ usuario, password }),
      })
      onLoginSuccess(data)
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
          <p className="eyebrow">Acceso al sistema</p>
          <h1>Iniciar sesión con JWT</h1>
          <p className="lead">
            El backend genera un token y React lo usa para mostrarte el tablero correcto según tu
            rol. El acceso está diseñado para ser rápido, claro y seguro.
          </p>

          <div className="hero-steps">
            <article>
              <strong>Empresa</strong>
              <span>Correo + contraseña para publicar puestos y buscar candidatos.</span>
            </article>
            <article>
              <strong>Oferente</strong>
              <span>Correo + contraseña para administrar habilidades y tu CV.</span>
            </article>
            <article>
              <strong>Administrador</strong>
              <span>Identificación + contraseña para aprobar registros y catálogos.</span>
            </article>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="eyebrow">Acceso rápido</p>
          <div className="role-badges">
            <span className="role-badge">Empresa</span>
            <span className="role-badge">Oferente</span>
            <span className="role-badge">Admin</span>
          </div>
          <p>
            Si tu cuenta todavía no fue aprobada, la plataforma te mostrará un mensaje de bloqueo
            claro para que sepas qué falta.
          </p>
        </aside>
      </div>

      <div className="content-card auth-card">
        {error ? <p className="error-banner">{error}</p> : null}

        <form className="auth-form" onSubmit={submit}>
          <label>
            Correo electrónico o identificación
            <input
              type="text"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              required
              autoComplete="username"
              placeholder="Correo de empresa/oferente o identificación de administrador"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <div className="page-actions">
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Validando...' : 'Entrar'}
            </button>
            <button type="button" className="secondary-button" onClick={() => onNavigate('home')}>
              Volver al inicio
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default LoginScreen


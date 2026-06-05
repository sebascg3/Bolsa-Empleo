import { useState } from 'react'
import { createPortal } from 'react-dom'
import { requestJSON } from '../lib/api.js'

function LoginModal({ onLoginSuccess, onClose }) {
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

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) onClose()
    }

    return createPortal(
        <div className="login-backdrop" onClick={handleBackdropClick}
             role="dialog" aria-modal="true" aria-label="Iniciar sesión">
            <div className="login-modal-box">
                <div className="login-modal-header">
                    <div className="login-modal-icon"><span>BE</span></div>
                    <h2 className="login-modal-title">Login</h2>
                </div>

                {error ? <p className="error-banner">{error}</p> : null}

                <form className="auth-form login-modal-form" onSubmit={submit}>
                    <label>
                        Usuario
                        <input type="text" value={usuario}
                               onChange={(e) => setUsuario(e.target.value)}
                               required autoComplete="username"
                               placeholder="Correo o identificación" autoFocus />
                    </label>
                    <label>
                        Clave
                        <input type="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               required autoComplete="current-password" />
                    </label>
                    <div className="page-actions">
                        <button type="submit" className="primary-button" disabled={loading}>
                            {loading ? 'Validando...' : 'Ingresar'}
                        </button>
                        <button type="button" className="secondary-button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}

export default LoginModal
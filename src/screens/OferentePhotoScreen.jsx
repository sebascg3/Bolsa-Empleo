import { useEffect, useMemo, useState } from 'react'
import { requestJSON } from '../lib/api.js'

function OferentePhotoScreen({ token, onNavigate }) {
    const [fotoPerfil, setFotoPerfil] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [photoVersion, setPhotoVersion] = useState(0)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const fotoUrl = useMemo(() => {
        if (previewUrl) return previewUrl

        if (fotoPerfil) {
            return `http://localhost:8080/fotos/${fotoPerfil}?v=${photoVersion}`
        }

        return ''
    }, [fotoPerfil, previewUrl, photoVersion])

    useEffect(() => {
        async function loadPhoto() {
            try {
                setLoading(true)
                setError('')

                const response = await requestJSON('/oferente/foto', { token })

                setFotoPerfil(response?.fotoPerfil || '')
            } catch (err) {
                setError(err instanceof Error ? err.message : 'No se pudo cargar la foto.')
            } finally {
                setLoading(false)
            }
        }

        void loadPhoto()
    }, [token])

    function handleFileChange(event) {
        const file = event.target.files?.[0] || null

        setSelectedFile(file)
        setMessage('')
        setError('')

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }

        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setPreviewUrl('')
        }
    }

    async function uploadPhoto(event) {
        event.preventDefault()

        if (!selectedFile) {
            setError('Debes seleccionar una imagen.')
            return
        }

        try {
            setSaving(true)
            setError('')
            setMessage('')

            const formData = new FormData()
            formData.append('foto', selectedFile)

            const response = await requestJSON('/oferente/foto', {
                method: 'POST',
                token,
                body: formData,
            })

            setFotoPerfil(response.fotoPerfil || '')
            setSelectedFile(null)

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }

            setPreviewUrl('')
            setPhotoVersion((current) => current + 1)

            setMessage('Foto de perfil actualizada correctamente.')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo subir la foto.')
        } finally {
            setSaving(false)
        }
    }
    async function deletePhoto() {
        try {
            setSaving(true)
            setError('')
            setMessage('')

            await requestJSON('/oferente/foto', {
                method: 'DELETE',
                token,
            })

            setFotoPerfil('')
            setSelectedFile('')

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }

            setPreviewUrl('')
            setPhotoVersion((current) => current + 1)

            setMessage('Foto eliminada correctamente.')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo eliminar la foto.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <section className="page-section">
            <div className="content-card auth-card">
                <div className="card-heading">
                    <p className="eyebrow">Perfil</p>
                    <h2>Mi foto de perfil</h2>
                </div>

                {loading ? <p className="info-banner">Cargando foto...</p> : null}
                {error ? <p className="error-banner">{error}</p> : null}
                {message ? <p className="global-message">{message}</p> : null}

                <form className="auth-form" onSubmit={uploadPhoto}>
                    <div className="photo-manager">
                        {fotoUrl ? (
                            <img
                                src={fotoUrl}
                                alt="Foto de perfil"
                                className="profile-photo-large"
                            />
                        ) : (
                            <div className="profile-photo-placeholder large">
                                👤
                            </div>
                        )}

                        <label>
                            Seleccionar imagen
                            <input
                                type="file"
                                accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <div className="page-actions">
                        <button
                            className="primary-button"
                            type="submit"
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar foto'}
                        </button>

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={deletePhoto}
                            disabled={saving}
                        >
                            Eliminar foto
                        </button>

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={() => onNavigate('oferente')}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default OferentePhotoScreen
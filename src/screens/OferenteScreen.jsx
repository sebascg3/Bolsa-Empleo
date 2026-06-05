import { useEffect, useMemo, useState } from 'react'
import RouteCards from '../components/RouteCards.jsx'
import { requestJSON } from '../lib/api.js'

function OferenteScreen({ token, onNavigate }) {
  const [fotoPerfil, setFotoPerfil] = useState('')
  const [photoVersion, setPhotoVersion] = useState(0)

  const shortcuts = [
    {
      key: 'oferente-skills',
      title: 'Mis habilidades',
      description: 'Edita tus destrezas y niveles por característica.',
      cta: 'Abrir habilidades',
      path: 'oferente-skills',
    },
    {
      key: 'oferente-cv',
      title: 'Mi CV',
      description: 'Gestiona tu archivo PDF de currículo.',
      cta: 'Abrir CV',
      path: 'oferente-cv',
    },
  ]

  const fotoUrl = useMemo(() => {
    if (!fotoPerfil) return ''
    return `http://localhost:8080/fotos/${fotoPerfil}?v=${photoVersion}`
  }, [fotoPerfil, photoVersion])

  useEffect(() => {
    async function loadPhoto() {
      try {
        const response = await requestJSON('/oferente/foto', { token })
        console.log("FOTO:", response)
        if (typeof response === 'string') {
          setFotoPerfil(response)
        } else {
          setFotoPerfil(response?.fotoPerfil || '')
        }

        setPhotoVersion((current) => current + 1)
      } catch {
        setFotoPerfil('')
      }
    }

    void loadPhoto()
  }, [token])

  return (
      <section className="page-section">
        <div className="content-card full-width">
          <div className="profile-header">
            {fotoUrl ? (
                <img
                    src={fotoUrl}
                    alt="Foto de perfil"
                    className="profile-photo-large"
                    onError={() => setFotoPerfil('')}
                />
            ) : (
                <div className="profile-photo-placeholder">
                  <span>👤</span>
                </div>
            )}

            <h2>Mi Perfil</h2>

            <button
                className="secondary-button"
                type="button"
                onClick={() => onNavigate('oferente-photo')}
            >
              Cambiar foto
            </button>
          </div>

          <RouteCards items={shortcuts} onNavigate={onNavigate} />
        </div>
      </section>
  )
}

export default OferenteScreen
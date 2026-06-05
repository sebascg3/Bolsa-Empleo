import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { requestJSON } from '../lib/api.js'

function CompanyCandidateProfileScreen({ token }) {
    const { candidateId } = useParams()
    const [searchParams] = useSearchParams()
    const puestoId = searchParams.get('puestoId')

    const [candidate, setCandidate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fotoUrl = useMemo(() => {
        if (!candidate?.fotoPerfil) return ''
        return `http://localhost:8080/fotos/${candidate.fotoPerfil}`
    }, [candidate])

    useEffect(() => {
        if (!token || !candidateId) return

        let active = true

        async function load() {
            try {
                setLoading(true)

                const suffix = puestoId ? `?puestoId=${puestoId}` : ''
                const data = await requestJSON(`/empresa/candidatos/${candidateId}${suffix}`, { token })

                if (active) {
                    setCandidate(data)
                    setError('')
                }
            } catch (err) {
                if (active) {
                    setError(err instanceof Error ? err.message : 'No se pudo cargar el perfil')
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        void load()

        return () => {
            active = false
        }
    }, [token, candidateId, puestoId])

    async function openCv() {
        if (!candidate?.cv) return

        try {
            const response = await fetch(`/api/empresa/candidatos/${candidate.id}/cv`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('No se pudo abrir el CV')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            window.open(url, '_blank')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo abrir el CV')
        }
    }

    return (
        <section className="page-section">
            {loading ? <p className="info-banner">Cargando perfil del candidato...</p> : null}
            {error ? <p className="error-banner">{error}</p> : null}

            {candidate ? (
                <>
                    <div className="content-card full-width">
                        <div className="candidate-profile-header">
                            {fotoUrl ? (
                                <img
                                    src={fotoUrl}
                                    alt={`Foto de ${candidate.nombre}`}
                                    className="candidate-profile-photo"
                                />
                            ) : (
                                <div className="profile-photo-placeholder">
                                    <span>👤</span>
                                </div>
                            )}

                            <div className="card-heading candidate-profile-title">
                                <p className="eyebrow">Perfil del candidato</p>
                                <h2>{candidate.nombre}</h2>
                                <p className="muted-text">{candidate.correo}</p>
                            </div>
                        </div>

                        <div className="detail-list">
                            <article className="detail-item">
                                <strong>Correo</strong>
                                <span>{candidate.correo}</span>
                            </article>

                            <article className="detail-item">
                                <strong>Identificación</strong>
                                <span>{candidate.identificacion}</span>
                            </article>

                            <article className="detail-item">
                                <strong>Nacionalidad</strong>
                                <span>{candidate.nacionalidad || 'N/D'}</span>
                            </article>

                            <article className="detail-item">
                                <strong>Teléfono</strong>
                                <span>{candidate.telefono || 'N/D'}</span>
                            </article>

                            <article className="detail-item">
                                <strong>Residencia</strong>
                                <span>{candidate.residencia || 'N/D'}</span>
                            </article>

                            <article className="detail-item">
                                <strong>Compatibilidad</strong>
                                <span>{candidate.porcentaje ?? 0}%</span>
                            </article>
                        </div>

                        <div className="page-actions">
                            <button
                                className="primary-button"
                                type="button"
                                onClick={openCv}
                                disabled={!candidate.cv}
                            >
                                Ver CV
                            </button>
                        </div>
                    </div>

                    <div className="content-card full-width">
                        <div className="card-heading">
                            <p className="eyebrow">Habilidades</p>
                            <h2>Perfil técnico</h2>
                        </div>

                        <div className="registered-skills-grid">
                            {candidate.habilidades?.length > 0 ? (
                                candidate.habilidades.map((skill) => (
                                    <article key={skill.id} className="registered-skill-card">
                                        <strong>{skill.nombre}</strong>
                                        <span>Nivel {skill.nivel}</span>
                                    </article>
                                ))
                            ) : (
                                <p className="empty-state">Este candidato no tiene habilidades registradas.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : null}
        </section>
    )
}

export default CompanyCandidateProfileScreen
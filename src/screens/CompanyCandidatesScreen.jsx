import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import JobCard from '../components/JobCard.jsx'
import { requestJSON } from '../lib/api.js'

function CompanyCandidatesScreen({ token, onNavigate }) {
    const { puestoId } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token || !puestoId) return

        let active = true

        async function load() {
            try {
                setLoading(true)
                const response = await requestJSON(`/empresa/puestos/${puestoId}/candidatos`, { token })

                if (active) {
                    setData(response)
                    setError('')
                }
            } catch (err) {
                if (active) {
                    setError(err instanceof Error ? err.message : 'No se pudieron cargar los candidatos')
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        void load()

        return () => {
            active = false
        }
    }, [token, puestoId])

    return (
        <section className="page-section">
            {loading ? <p className="info-banner">Cargando candidatos...</p> : null}
            {error ? <p className="error-banner">{error}</p> : null}

            {data ? (
                <>
                    <div className="content-card full-width">
                        <div className="card-heading">
                            <p className="eyebrow">Puesto seleccionado</p>
                            <h2>Candidatos compatibles</h2>
                        </div>

                        <JobCard job={data.puesto} />

                        <p className="global-message">
                            Candidatos encontrados: {data.candidatos.length} | Requisitos del puesto:{' '}
                            {data.totalRequisitos}
                        </p>
                    </div>

                    <div className="content-card full-width">
                        <div className="card-heading">
                            <p className="eyebrow">Candidatos</p>
                            <h2>Resultados de compatibilidad</h2>
                        </div>

                        <div className="pending-grid">
                            {data.candidatos.map((candidate) => (
                                <article key={candidate.id} className="candidate-card">
                                    <div>
                                        <p className="eyebrow">Candidato</p>
                                        <h3>
                                            {candidate.nombre}
                                            {candidate.apellido ? ` ${candidate.apellido}` : ''}
                                        </h3>

                                        <div className="candidate-info">
                      <span>
                        <strong>Correo:</strong> {candidate.correo}
                      </span>
                                            <span>
                        <strong>Identificación:</strong> {candidate.identificacion}
                      </span>
                                            <span>
                        <strong>Compatibilidad:</strong> {candidate.porcentaje}%
                      </span>
                                        </div>
                                    </div>

                                    <button
                                        className="primary-button"
                                        type="button"
                                        onClick={() => onNavigate(`/empresa/candidatos/${candidate.id}?puestoId=${puestoId}`)}
                                    >
                                        Ver perfil
                                    </button>
                                </article>
                            ))}
                        </div>

                        {data.candidatos.length === 0 ? (
                            <p className="empty-state">No se encontraron candidatos compatibles.</p>
                        ) : null}
                    </div>
                </>
            ) : null}
        </section>
    )
}

export default CompanyCandidatesScreen
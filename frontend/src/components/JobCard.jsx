import { useState } from 'react'

function JobCard({ job }) {
  const [hovered, setHovered] = useState(false)
  const requisitos = job.requisitos || []

  return (
      <article
          className="job-card"
          style={{ position: 'relative' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
      >
        <div className="job-card__topline">
          <div>
            <p className="job-card__company">{job.empresa || 'Empresa no disponible'}</p>
            <h3>{job.descripcion || 'Puesto sin descripción'}</h3>
          </div>
          <span className="job-pill">{job.tipo || 'N/D'}</span>
        </div>

        <dl className="job-card__meta">
          <div>
            <dt>Salario</dt>
            <dd>{job.salario}</dd>
          </div>
          {job.coincidencia != null ? (
              <div>
                <dt>Coincidencia</dt>
                <dd>{job.coincidencia}%</dd>
              </div>
          ) : null}
          <div>
            <dt>Fecha</dt>
            <dd>{job.fecha}</dd>
          </div>
          <div>
            <dt>Activo</dt>
            <dd>{job.activo ? 'Sí' : 'No'}</dd>
          </div>
        </dl>

        {hovered && requisitos.length > 0 ? (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 10,
              background: 'var(--color-background-primary)',
              border: '1px solid var(--color-border-secondary)',
              borderRadius: '8px',
              padding: '10px 14px',
              minWidth: '200px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}>
              <p style={{ margin: '0 0 6px', fontWeight: 500, fontSize: '13px' }}>Requisitos</p>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', lineHeight: 1.8 }}>
                {requisitos.map((r, i) => (
                    <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
        ) : null}
      </article>
  )
}

export default JobCard
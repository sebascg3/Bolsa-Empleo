import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

function JobCard({ job }) {
  const [hovered, setHovered] = useState(false)
  const [popoverStyle, setPopoverStyle] = useState(null)
  const requisitos = job.requisitos || []
  const isActive = Boolean(job.activo)
  const visibility = job.tipo || 'N/D'
  const cardRef = useRef(null)

  useEffect(() => {
    if (!hovered || !cardRef.current) {
      setPopoverStyle(null)
      return
    }

    function update() {
      const rect = cardRef.current.getBoundingClientRect()
      const margin = 16
      const maxWidth = Math.min(320, window.innerWidth - margin * 2)
      let left = rect.left
      if (left + maxWidth + margin > window.innerWidth) {
        left = Math.max(margin, window.innerWidth - maxWidth - margin)
      }
      const top = rect.bottom + 10
      setPopoverStyle({ position: 'fixed', top: `${top}px`, left: `${left}px`, minWidth: `${maxWidth}px`, zIndex: 660 })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [hovered])

  return (
      <article
        className="job-card"
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
      <div className="job-card__topline">
        <div>
          <p className="job-card__company">{job.empresa || 'Empresa no disponible'}</p>
          <h3>{job.descripcion || 'Puesto sin descripción'}</h3>
        </div>
        <div className="job-card__badges">
          <span className="job-pill">{visibility}</span>
          <span className={`job-pill job-pill--state ${isActive ? 'is-active' : 'is-inactive'}`}>
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
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
          <dt>Requisitos</dt>
          <dd>{requisitos.length}</dd>
        </div>
      </dl>

      {hovered && requisitos.length > 0
        ? // render popover into body via portal so it can't be clipped by sibling cards
          createPortal(
            <div
              className="job-card__popover"
              style={popoverStyle || undefined}
              role="dialog"
              aria-label="Detalles de requisitos"
            >
              <p className="job-card__popover-title">Requisitos</p>
              <ul className="job-card__requisitos">
                {requisitos.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>,
            document.body
          )
        : null}
    </article>
  )
}

export default JobCard
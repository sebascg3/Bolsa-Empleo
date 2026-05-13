function JobCard({ job }) {
  return (
    <article className="job-card">
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
    </article>
  )
}

export default JobCard


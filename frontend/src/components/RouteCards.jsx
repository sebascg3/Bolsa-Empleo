function RouteCards({ items, onNavigate }) {
  if (!items?.length) {
    return null
  }

  return (
    <div className="route-grid">
      {items.map((item) => (
        <article key={item.key} className="route-card">
          <div>
            <p className="eyebrow">{item.eyebrow}</p>
            <h2>{item.title}</h2>
            <p className="route-card__description">{item.description}</p>
          </div>
          <div className="page-actions route-card__actions">
            <button
              type="button"
              className={item.variant === 'secondary' ? 'secondary-button' : 'primary-button'}
              onClick={() => onNavigate(item.path)}
            >
              {item.cta}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default RouteCards


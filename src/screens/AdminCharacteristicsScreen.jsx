import { useEffect, useState } from 'react'
import { requestJSON } from '../lib/api.js'

function AdminCharacteristicsScreen({ token }) {
  const [tree, setTree] = useState([])
  const [characteristicForm, setCharacteristicForm] = useState({ nombre: '' })
  const [selectedParentId, setSelectedParentId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return
    void loadTree()
  }, [token])

  async function loadTree() {
    try {
      setLoading(true)
      const treeData = await requestJSON('/admin/caracteristicas', { token })
      setTree(treeData || [])
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  async function selectParent(id) {
    setSelectedParentId(id)
    setSuccess('')

    try {
      const data = await requestJSON(`/admin/caracteristicas/${id}`, { token })
      setDetail(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el detalle')
    }
  }

  function clearParent() {
    setSelectedParentId(null)
    setDetail(null)
  }

  async function createCharacteristic(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const data = new FormData()
      data.append('nombre', characteristicForm.nombre)

      if (selectedParentId) {
        data.append('padreId', String(selectedParentId))
      }

      await requestJSON('/admin/caracteristicas', {
        token,
        method: 'POST',
        body: data,
      })

      setSuccess('Característica creada correctamente.')
      setCharacteristicForm({ nombre: '' })
      await loadTree()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la característica')
    }
  }

  const visibleCharacteristics = detail ? detail.children : tree
  return (
      <section className="page-section">
        {loading ? <p className="info-banner">Cargando características...</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
        {success ? <p className="global-message">{success}</p> : null}



        <div className="characteristics-layout">
          <div className="content-card">
            <div className="card-heading">
              <p className="eyebrow">Caracteristicas</p>
              <h2>Seleccionar característica padre</h2>
            </div>

            <div className="search-panel">
              {detail ? (
                  <button
                      className="secondary-button"
                      type="button"
                      onClick={clearParent}
                      style={{ marginBottom: '12px' }}
                  >
                    Volver a raíces
                  </button>
              ) : null}

              <div className="level-list">
                {visibleCharacteristics.length > 0 ? (
                    visibleCharacteristics.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className="level-item"
                            onClick={() => selectParent(item.id)}
                        >
                          <span>{item.nombre}</span>
                          <strong>›</strong>
                        </button>
                    ))
                ) : (
                    <p className="empty-state">
                      Esta característica no tiene hijas.
                    </p>
                )}
              </div>
            </div><span>
{detail ? (
    <div className="breadcrumb-route">
      {detail.route.map((item, index) => (
          <button
              key={item.id}
              type="button"
              onClick={() => selectParent(item.id)}
          >
            {item.nombre}
            {index < detail.route.length - 1 ? ' / ' : ''}
          </button>
      ))}
    </div>
) : (
    <span>Ninguno, se creará como característica raíz</span>
)}
</span>
            <div className="page-actions">
              <button className="secondary-button" type="button" onClick={clearParent}>
                Crear como raíz
              </button>
            </div>
          </div>

          <div className="content-card">
            <div className="card-heading">
              <p className="eyebrow">Crear característica</p>

            </div>

            <div className="parent-card">
              <strong>Padre seleccionado</strong>

              <div className="parent-card-route">
                {detail
                    ? detail.route.map((item) => item.nombre).join(' / ')
                    : 'Ninguno, se creará como característica raíz'}
              </div>
            </div>

            <form className="characteristic-form" onSubmit={createCharacteristic}>
              <label>
                Nombre de la característica <span className="required-field">*</span>
                <input
                    name="nombre"
                    value={characteristicForm.nombre}
                    onChange={(e) => setCharacteristicForm({ nombre: e.target.value })}
                    required
                />
              </label>

              <div className="page-actions">
                <button className="primary-button" type="submit">
                  Guardar característica
                </button>

              </div>
            </form>
          </div>
        </div>


      </section>
  )
}

export default AdminCharacteristicsScreen
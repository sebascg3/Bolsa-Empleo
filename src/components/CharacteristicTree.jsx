function CharacteristicTree({ nodes, selectedIds, onToggle, depth = 0 }) {
  if (!nodes || nodes.length === 0) {
    return null
  }

  return (
    <ul className="tree-list" style={{ '--tree-depth': depth }}>
      {nodes.map((node) => {
        const id = node.id
        const checked = selectedIds.includes(id)

        return (
          <li key={id} className="tree-item">
            <label className="tree-node">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(id)}
              />
              <span>
                {node.nombre}
                {node.padreId ? null : <strong className="tree-root-tag">Raíz</strong>}
              </span>
            </label>
            <CharacteristicTree
              nodes={node.hijos}
              selectedIds={selectedIds}
              onToggle={onToggle}
              depth={depth + 1}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default CharacteristicTree


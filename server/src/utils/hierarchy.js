/**
 * Build a nested hierarchy object from a flat array of nodes.
 * Each node: { name, description, parent }
 * Returns either the single root node or a synthetic root when multiple roots exist.
 */
function buildHierarchy(flat) {
  if (!Array.isArray(flat) || flat.length === 0) {
    return { name: 'root', description: '', children: [] };
  }

  const map = {};
  flat.forEach(n => {
    map[n.name] = { name: n.name, description: n.description || '', parent: n.parent || '', children: [] };
  });

  const roots = [];
  flat.forEach(n => {
    const node = map[n.name];
    if (node.parent && node.parent !== "") {
      const parent = map[node.parent];
      if (parent) parent.children.push(node);
      else roots.push(node); // orphan -> treat as root
    } else {
      roots.push(node);
    }
  });

  if (roots.length === 1) return roots[0];
  return { name: 'root', description: '', children: roots };
}

module.exports = { buildHierarchy };
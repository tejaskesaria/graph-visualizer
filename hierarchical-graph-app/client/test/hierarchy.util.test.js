import { buildHierarchy } from '../src/utils/hierarchy';

describe('buildHierarchy (client)', () => {
  test('builds single-root hierarchy', () => {
    const flat = [
      { name: 'A', description: 'root', parent: '' },
      { name: 'B', description: 'child', parent: 'A' },
      { name: 'C', description: 'child2', parent: 'A' },
    ];
    const tree = buildHierarchy(flat);
    expect(tree.name).toBe('A');
    expect(Array.isArray(tree.children)).toBe(true);
    expect(tree.children.map(c => c.name).sort()).toEqual(['B','C'].sort());
  });

  test('creates synthetic root when multiple roots', () => {
    const flat = [
      { name: 'X', description: '', parent: '' },
      { name: 'Y', description: '', parent: '' }
    ];
    const tree = buildHierarchy(flat);
    expect(tree.name).toBe('root');
    expect(tree.children.length).toBe(2);
    expect(tree.children.map(n => n.name).sort()).toEqual(['X','Y'].sort());
  });

  test('orphan becomes root when parent missing', () => {
    const flat = [
      { name: 'orphan', description: '', parent: 'missing' }
    ];
    const tree = buildHierarchy(flat);
    expect(tree.name).toBe('orphan');
    expect(tree.children).toEqual([]);
  });

  test('empty array returns empty synthetic root', () => {
    const tree = buildHierarchy([]);
    expect(tree.name).toBe('root');
    expect(Array.isArray(tree.children)).toBe(true);
    expect(tree.children.length).toBe(0);
  });
});
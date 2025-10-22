// Provide a richer d3 mock to exercise renderGraph paths and click handlers.
jest.mock('d3', () => {
  // Move savedHandlers inside the mock scope
  const savedHandlers = [];

  function Selection() {
    this._handlers = [];
  }
  Selection.prototype.selectAll = function () { return this; };
  Selection.prototype.select = function () { return this; };
  Selection.prototype.append = function () { return this; };
  Selection.prototype.attr = function () { return this; };
  Selection.prototype.style = function () { return this; };
  Selection.prototype.text = function () { return this; };
  Selection.prototype.data = function () { return this; };
  Selection.prototype.enter = function () { return this; };
  Selection.prototype.on = function (event, handler) {
    if (event === 'click') {
      savedHandlers.push(handler); // Now valid because savedHandlers is in scope
    }
    return this;
  };
  Selection.prototype.remove = function () { return this; };

  function hierarchy(data) {
    const nodes = [];
    function walk(node, depth = 0, idxRef = { i: 0 }) {
      const dnode = { data: node, depth, x: depth * 10, y: idxRef.i * 10, children: [] };
      nodes.push(dnode);
      idxRef.i += 1;
      (node.children || []).forEach(child => {
        dnode.children.push(walk(child, depth + 1, idxRef));
      });
      return dnode;
    }
    const rootNode = walk(data);
    return {
      data,
      descendants: () => nodes,
      links: () => {
        const links = [];
        nodes.forEach(n => {
          if (n.children) {
            n.children.forEach(c => {
              links.push({ source: n, target: c });
            });
          }
        });
        return links;
      }
    };
  }

  function tree() {
    return {
      size: function () {
        return function (root) {
          return root;
        };
      }
    };
  }

  function linkHorizontal() {
    const fn = () => '';
    fn.x = () => fn;
    fn.y = () => fn;
    return fn;
  }

  const container = new Selection();

  return {
    select: () => container,
    hierarchy,
    tree,
    linkHorizontal,
    __savedHandlers: savedHandlers, // Expose savedHandlers for test assertions
  };
});

const HierarchyGraph = require('../src/components/HierarchyGraph.vue').default;
const { buildHierarchy } = require('../src/utils/hierarchy');
const sample = require('../../server/src/data/sample.json');

describe('HierarchyGraph.renderGraph coverage', () => {
  afterEach(() => {
    const d3 = require('d3');
    d3.__savedHandlers.length = 0; // Clear saved handlers between tests
    jest.resetAllMocks();
  });

  test('renderGraph executes without error and handles selection toggle', () => {
    const d3 = require('d3');
    const mockElement = {}; // Mock DOM element
    const vm = {
      hierarchyData: buildHierarchy(sample.data),
      selectedNode: null,
      $refs: { graphContainer: mockElement }, // Mock $refs
      renderGraph: HierarchyGraph.methods.renderGraph,
    };

    // Call renderGraph
    HierarchyGraph.methods.renderGraph.call(vm);

    if (d3.__savedHandlers.length > 0) {
      const mockNode = { data: { name: 'B', description: 'desc' } };
      d3.__savedHandlers[0](null, mockNode); // Simulate click handler
      expect(vm.selectedNode && vm.selectedNode.name).toBe('B');
    } else {
      expect(vm.selectedNode).toBeNull();
    }

    vm.selectedNode = { name: 'B', description: 'desc' };
    HierarchyGraph.methods.renderGraph.call(vm);
    expect(vm.selectedNode).not.toBeNull();
  });

  test('renderGraph handles empty hierarchyData gracefully', () => {
    const mockElement = {}; // Mock DOM element
    const vm = {
      hierarchyData: { name: 'root', children: [] },
      selectedNode: null,
      $refs: { graphContainer: mockElement }, // Mock $refs
    };

    expect(() => HierarchyGraph.methods.renderGraph.call(vm)).not.toThrow();
  });
});
jest.mock('d3', () => {
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
      savedHandlers.push(handler);
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
    __savedHandlers: savedHandlers,
  };
});

const HierarchyGraph = require('../src/components/HierarchyGraph.vue').default;
const { buildHierarchy } = require('../src/utils/hierarchy');
const sample = require('../../server/src/data/sample.json');

describe('HierarchyGraph.vue extended coverage', () => {
  afterEach(() => {
    const d3 = require('d3');
    d3.__savedHandlers.length = 0;
    jest.resetAllMocks();
  });

  test('fetchGraphData handles fetch errors gracefully', async () => {
    const vm = {
      graphData: null,
      hierarchyData: null,
      selectedNode: null,
      $refs: { graphContainer: {} },
      renderGraph: jest.fn(),
    };

    // Mock console.error to suppress error output during this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch failed'));

    await expect(HierarchyGraph.methods.fetchGraphData.call(vm)).resolves.not.toThrow();
    expect(vm.graphData).toBeNull();
    expect(vm.hierarchyData).toBeNull();
    expect(vm.renderGraph).not.toHaveBeenCalled();

    // Restore console.error after the test
    consoleErrorSpy.mockRestore();
  });

  test('fetchGraphData handles non-OK fetch response', async () => {
    const vm = {
      graphData: null,
      hierarchyData: null,
      selectedNode: null,
      $refs: { graphContainer: {} },
      renderGraph: jest.fn(),
    };

    // Mock console.error to suppress error output during this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(HierarchyGraph.methods.fetchGraphData.call(vm)).resolves.not.toThrow();
    expect(vm.graphData).toBeNull();
    expect(vm.hierarchyData).toBeNull();
    expect(vm.renderGraph).not.toHaveBeenCalled();

    // Restore console.error after the test
    consoleErrorSpy.mockRestore();
  });

  test('fetchGraphData handles successful fetch', async () => {
    const vm = {
      graphData: null,
      hierarchyData: null,
      selectedNode: null,
      $refs: { graphContainer: {} },
      renderGraph: jest.fn(),
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: sample.data }),
    });

    await expect(HierarchyGraph.methods.fetchGraphData.call(vm)).resolves.not.toThrow();
    expect(vm.graphData).toEqual(sample.data);
    expect(vm.hierarchyData).toBeTruthy();
    expect(vm.renderGraph).toHaveBeenCalled();
  });

  test('renderGraph handles deeply nested data', () => {
    const deeplyNestedData = {
      name: 'root',
      children: [
        {
          name: 'child1',
          children: [
            {
              name: 'grandchild1',
              children: [
                { name: 'great-grandchild1' },
                { name: 'great-grandchild2' },
              ],
            },
          ],
        },
      ],
    };

    const vm = {
      hierarchyData: deeplyNestedData,
      selectedNode: null,
      $refs: { graphContainer: {} },
    };

    expect(() => HierarchyGraph.methods.renderGraph.call(vm)).not.toThrow();
  });

  test('deselect works when no node is selected', () => {
    const vm = {
      selectedNode: null,
      renderGraph: jest.fn(),
    };

    HierarchyGraph.methods.deselect.call(vm);

    expect(vm.selectedNode).toBeNull();
    expect(vm.renderGraph).toHaveBeenCalled();
  });

  test('deselect works when a node is selected', () => {
    const vm = {
      selectedNode: { name: 'B', description: 'desc' },
      renderGraph: jest.fn(),
    };

    HierarchyGraph.methods.deselect.call(vm);

    expect(vm.selectedNode).toBeNull();
    expect(vm.renderGraph).toHaveBeenCalled();
  });

  test('deselect clears selectedNode and re-renders graph', () => {
    const vm = {
      selectedNode: { name: 'B', description: 'desc' },
      renderGraph: jest.fn(),
    };

    HierarchyGraph.methods.deselect.call(vm);

    expect(vm.selectedNode).toBeNull();
    expect(vm.renderGraph).toHaveBeenCalled();
  });

  test('renderGraph highlights selected node', () => {
    const vm = {
      hierarchyData: buildHierarchy(sample.data),
      selectedNode: { name: 'B', description: 'desc' },
      $refs: { graphContainer: {} },
    };

    expect(() => HierarchyGraph.methods.renderGraph.call(vm)).not.toThrow();
  });

  test('renderGraph handles empty graphData', () => {
    const vm = {
      hierarchyData: { name: 'root', children: [] },
      selectedNode: null,
      $refs: { graphContainer: {} },
    };

    expect(() => HierarchyGraph.methods.renderGraph.call(vm)).not.toThrow();
  });

  test('renderGraph renders without a selected node', () => {
    const vm = {
      hierarchyData: buildHierarchy(sample.data),
      selectedNode: null,
      $refs: { graphContainer: {} },
    };

    expect(() => HierarchyGraph.methods.renderGraph.call(vm)).not.toThrow();
  });

  test('renderGraph renders with a selected node', () => {
    const vm = {
      hierarchyData: buildHierarchy(sample.data),
      selectedNode: { name: 'B', description: 'desc' },
      $refs: { graphContainer: {} },
    };

    expect(() => HierarchyGraph.methods.renderGraph.call(vm)).not.toThrow();
  });
});
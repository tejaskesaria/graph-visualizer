// Mock d3 (must run before importing the component to avoid Jest parsing ESM d3)
jest.mock('d3', () => {
  const container = {
    selectAll: () => ({ remove: () => {} }),
    append: () => container,
    attr: () => container,
    style: () => container,
    on: () => container,
    text: () => container,
    data: () => container,
    enter: () => container,
  };

  return {
    select: () => container,
    hierarchy: (data) => ({
      data,
      links: () => [],
      descendants: () => [],
    }),
    tree: () => (root) => {},
    linkHorizontal: () => {
      const fn = () => '';
      fn.x = () => fn;
      fn.y = () => fn;
      return fn;
    },
  };
});

const HierarchyGraph = require('../src/components/HierarchyGraph.vue').default;
const sample = require('../../server/src/data/sample.json');

describe('HierarchyGraph (method tests)', () => {
  const realFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: sample.data })
    });
  });

  afterEach(() => {
    global.fetch = realFetch;
    jest.resetAllMocks();
  });

  test('fetchGraphData sets graphData, hierarchyData and calls renderGraph', async () => {
    const vm = {
      graphData: null,
      hierarchyData: null,
      selectedNode: null,
      $refs: { graphContainer: {} },
      renderGraph: jest.fn()
    };

    // call the component method directly with vm as this
    await HierarchyGraph.methods.fetchGraphData.call(vm);

    expect(global.fetch).toHaveBeenCalled();
    expect(Array.isArray(vm.graphData)).toBe(true);
    expect(vm.hierarchyData).toBeTruthy();
    expect(vm.renderGraph).toHaveBeenCalled();
  });

  test('deselect clears selectedNode and calls renderGraph', () => {
    const vm = {
      selectedNode: { name: 'B', description: 'x' },
      renderGraph: jest.fn()
    };

    HierarchyGraph.methods.deselect.call(vm);

    expect(vm.selectedNode).toBeNull();
    expect(vm.renderGraph).toHaveBeenCalled();
  });
});
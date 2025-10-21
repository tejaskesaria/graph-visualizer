<template>
  <div style="display:flex">
    <div ref="graphContainer" class="graph-container"></div>
    <div class="sidebar" v-if="selectedNode" style="margin-left:16px; padding:8px; border-left:1px solid #ddd; width:240px;">
      <h3>{{ selectedNode.name }}</h3>
      <p>{{ selectedNode.description }}</p>
      <button @click="deselect">Deselect</button>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'HierarchyGraph',
  data() {
    return {
      graphData: null,       // flat array from backend
      hierarchyData: null,   // nested object for d3.hierarchy
      selectedNode: null
    };
  },
  mounted() {
    this.fetchGraphData();
  },
  methods: {
    async fetchGraphData() {
      try {
        const res = await fetch('http://localhost:3000/api/data'); // backend port 3000
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        this.graphData = json.data || [];
        this.hierarchyData = this.buildHierarchy(this.graphData);
        this.renderGraph();
      } catch (err) {
        console.error('Error fetching graph data:', err);
      }
    },

    buildHierarchy(flat) {
      const map = {};
      flat.forEach(n => {
        map[n.name] = { ...n, children: [] };
      });
      const roots = [];
      flat.forEach(n => {
        if (n.parent && n.parent !== "") {
          const parent = map[n.parent];
          if (parent) parent.children.push(map[n.name]);
          else roots.push(map[n.name]); // orphaned child becomes root if parent missing
        } else {
          roots.push(map[n.name]);
        }
      });
      if (roots.length === 1) return roots[0];
      return { name: 'root', description: '', children: roots };
    },

    deselect() {
      this.selectedNode = null;
      // visually remove selection (re-render to reset)
      this.renderGraph();
    },

    renderGraph() {
      const width = 900;
      const height = 600;
      const container = d3.select(this.$refs.graphContainer);
      container.selectAll('*').remove();

      const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(40,20)');

      const root = d3.hierarchy(this.hierarchyData);
      const treeLayout = d3.tree().size([height - 40, width - 160]);
      treeLayout(root);

      // links
      svg.selectAll('path.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x))
        .attr('fill', 'none')
        .attr('stroke', '#ccc');

      const vm = this;

      // nodes
      const node = svg.selectAll('g.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .style('cursor', 'pointer');

      node.append('circle')
        .attr('r', 6)
        .attr('fill', d => (vm.selectedNode && vm.selectedNode.name === d.data.name) ? '#ff7043' : (d.children ? '#555' : '#999'))
        .on('click', function(event, d) {
          vm.selectedNode = d.data;
          // bring selected node into view if needed; here we simply re-render to update color
          vm.renderGraph();
        });

      node.append('text')
        .attr('dx', 10)
        .attr('dy', 4)
        .text(d => d.data.name)
        .on('click', function(event, d) {
          vm.selectedNode = d.data;
          vm.renderGraph();
        });
    },
  },
};
</script>

<style scoped>
.graph-container {
  margin: 20px;
}
</style>
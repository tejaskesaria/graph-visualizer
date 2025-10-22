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
import { buildHierarchy } from '../utils/hierarchy';

export default {
  name: 'HierarchyGraph',
  data() {
    return {
      graphData: null,
      hierarchyData: null,
      selectedNode: null
    };
  },
  mounted() {
    this.fetchGraphData();
  },
  methods: {
    async fetchGraphData() {
      try {
        const res = await fetch('http://localhost:3000/api/data');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        this.graphData = json.data || [];
        this.hierarchyData = buildHierarchy(this.graphData);
        this.renderGraph();
      } catch (err) {
        console.error('Error fetching graph data:', err);
      }
    },

    deselect() {
      this.selectedNode = null;
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
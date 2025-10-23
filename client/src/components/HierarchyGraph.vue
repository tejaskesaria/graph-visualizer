<template>
  <div class="graph-container">
    <div ref="graphContainer" class="d3-container"></div>
    <div v-if="selectedNode" class="sidebar">
      <div class="sidebar-content">
        <h3>{{ selectedNode.name }}</h3>
        <p>{{ selectedNode.description }}</p>
        <button class="deselect-btn" @click="deselect">Close</button>
      </div>
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
        // First try to fetch from new endpoint
        let res = await fetch('http://localhost:3000/api/graph/new');
        
        // If new endpoint fails, fallback to original endpoint
        if (!res.ok) {
          console.log('Falling back to original endpoint');
          res = await fetch('http://localhost:3000/api/graph');
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
        }

        const data = await res.json();
        this.graphData = data.data;
        this.hierarchyData = buildHierarchy(this.graphData);
        this.renderGraph();
      } catch (error) {
        console.error('Error fetching graph data:', error);
        this.graphData = null;
        this.hierarchyData = null;
        // Optionally show user-friendly error message
        alert('Failed to load graph data. Please try again later.');
      }
    },

    deselect() {
      this.selectedNode = null;
      this.renderGraph();
    },

    renderGraph() {
      const container = d3.select(this.$refs.graphContainer);
      container.selectAll("*").remove();

      const width = 800;
      const height = 600;

      const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .append('g')
        .attr('transform', 'translate(40,20)');

      // Add zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', (event) => {
          svg.attr('transform', event.transform);
        });

      container.select('svg').call(zoom);

      const root = d3.hierarchy(this.hierarchyData);
      const treeLayout = d3.tree().size([height - 40, width - 160]);
      treeLayout(root);

      // Add links with smooth curves
      svg.selectAll('path.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x))
        .attr('fill', 'none')
        .attr('stroke', '#2c3e50')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.4);

      // Add nodes with enhanced styling
      const nodes = svg.selectAll('g.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

      nodes.append('circle')
        .attr('r', 6)
        .attr('fill', d => this.selectedNode && d.data.name === this.selectedNode.name ? '#42b983' : '#3498db')
        .attr('stroke', '#2c3e50')
        .attr('stroke-width', 1.5)
        .on('mouseover', function() {
          d3.select(this)
            .attr('r', 8)
            .attr('fill', '#42b983');
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('r', 6)
            .attr('fill', d.data.name === this.selectedNode?.name ? '#42b983' : '#3498db');
        })
        .on('click', (event, d) => {
          this.selectedNode = d.data;
          this.renderGraph();
        });

      // Add labels with better positioning
      nodes.append('text')
        .attr('dy', '.31em')
        .attr('x', d => d.children ? -8 : 8)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name)
        .attr('fill', '#2c3e50')
        .attr('font-family', 'Arial, sans-serif')
        .attr('font-size', '12px');
    },
  },
};
</script>

<style scoped>
.graph-container {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
}

.d3-container {
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.sidebar-content {
  padding: 20px;
}

.sidebar h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.2em;
}

.sidebar p {
  color: #34495e;
  line-height: 1.6;
}

.deselect-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.deselect-btn:hover {
  background-color: #3aa876;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* D3 specific styles */
:deep(.link) {
  transition: stroke-opacity 0.2s;
}

:deep(.link:hover) {
  stroke-opacity: 0.8;
}

:deep(.node circle) {
  transition: r 0.2s, fill 0.2s;
}

:deep(.node text) {
  user-select: none;
}
</style>
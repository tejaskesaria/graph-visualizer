<template>
  <div id="app">
    <h1>Hierarchical Graph Visualization</h1>
    <HierarchyGraph />
  </div>
</template>

<script>
import HierarchyGraph from './components/HierarchyGraph.vue';

export default {
  name: 'App',
  components: {
    HierarchyGraph
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
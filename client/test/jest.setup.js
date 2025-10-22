// Expose Vue and compiler + server renderer to the test environment
globalThis.Vue = require('vue');
globalThis.VueCompilerDOM = require('@vue/compiler-dom');
globalThis.VueServerRenderer = require('@vue/server-renderer');
globalThis.flushPromises = require('flush-promises');
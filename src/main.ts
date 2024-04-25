import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';

import App from './App.vue';

// console.log("🚀 ~ file: main.ts:7 ~ import.meta.env:", import.meta.env);
const ENV = import.meta.env;
console.log('🚀 ~ file: main.ts:7 ~ ENV:', ENV);

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  return {
    app,
    Pinia,
  };
}

import Vue from 'vue';
// Estilos
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './registerServiceWorker';
import router from './router';
import store from './store';
import App from './App.vue';

// Importamos nuestros estilos globales de bulma
require('./assets/css/main.scss');

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

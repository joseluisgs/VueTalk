import Vue from 'vue';
// Estilos
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './registerServiceWorker';
import VueToast from 'vue-toast-notification';
import router from './router';
import store from './store';
import App from './App.vue';

// Firebase
import Firebase from './services/Firebase';
// Notificaciones
import 'vue-toast-notification/dist/theme-default.css';

console.log(`⚑ Firebase -> ${Firebase.defaultProject.name} ✓`);

// Configuración de las notificaciones
Vue.use(VueToast, {
  position: 'bottom',
});

// Importamos nuestros estilos globales de bulma
require('./assets/css/main.scss');

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

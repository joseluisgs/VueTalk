import Vue from 'vue';
import Vuex from 'vuex';

// Vamos a crear un módulo para cada modelo
import messages from './messages';
import rooms from './rooms';
import user from './user';
import utils from './utils';

Vue.use(Vuex);

// Creamos la store central
const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    checkAuth() { },
  },
  // Cargamos los módulos los cuales forman nuestro estado central
  modules: {
    messages,
    rooms,
    user,
    utils,
  },
});

// Exportamos
export default store;

// Comprobar si está autenticado
store.dispatch('checkAuth');

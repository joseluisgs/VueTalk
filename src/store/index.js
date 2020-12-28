/* eslint no-shadow: ["error", { "allow": ["user"] }] */

import Vue from 'vue';
import Vuex from 'vuex';

// Vamos a crear un módulo para cada modelo
import messages from './messages';
import rooms from './rooms';
import user from './user';
import utils from './utils';
import Service from '../services/Firebase';

Vue.use(Vuex);

// Creamos la store central
const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    /**
     * Actualiza el estado si existe el token de la sesión
     * @param {state} state
     */
    checkAuth({ commit }) {
      Service.auth.onAuthStateChanged((user) => {
        // Actualizamos el estado que está en el módulo de usuario
        if (user) {
          commit('user/setUser', user);
        } else {
          commit('user/setUser', user);
        }
      });
    },
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

// Comprobar si está autenticado lo lanzamos nada más cargar el store
store.dispatch('checkAuth');

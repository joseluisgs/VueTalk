/* eslint no-shadow: ["error", { "allow": ["user"] }] */

import Vue from 'vue';
import Vuex from 'vuex';

// Vamos a crear un módulo para cada modelo
import messages from './messages';
import rooms from './rooms';
import user from './user';
import utils from './utils';
import Service from '../services/Firebase';

/**
 * Los servicios en tiempo real hay que tocarlos en el estado directamente
 */

Vue.use(Vuex);

// Creamos la store central
const store = new Vuex.Store({
  state: {
    isLoading: true,
  },
  mutations: {
    /**
     * Cambia el estado de loading
     * @param {state} state
     * @param {boolean} loading
     */
    setLoading(state, loading) {
      state.isLoading = loading;
    },
  },
  actions: {
    /**
     * Actualiza el estado si existe el token de la sesión
     * Como es el tiempo real se programa aquí y no en servicios.
     * @param {state} state
     */
    checkAuth({ dispatch, commit }) {
      Service.auth.onAuthStateChanged(async (user) => {
        // Actualizamos el estado que está en el módulo de usuario
        // y las salas (síncrono, por eso es dispach al traernos por internet)
        if (user) {
          // usuario
          commit('user/setUser', user);
          try {
            await dispatch('user/getMeta');
            await dispatch('rooms/getRooms');
            await dispatch('messages/getMessages');
          } catch (error) {
            console.error(error.message);
            dispatch('utils/toast', { message: error.message, type: 'is-danger' });
          }
          dispatch('rooms/getRooms');
        } else {
          // Cuando no hay autentificación desactivamos los listeners y quitamos los datos
          // Metadatos
          commit('user/setMeta', {});
          commit('user/setUserListener', () => { });
          // Salas
          commit('rooms/setRooms', []);
          commit('rooms/setRoomsListener', () => { });
          // Mensajes
          commit('messages/setMessages', []);
          commit('messages/setMessagesListener', () => { });
          // usuario
          commit('user/setUser', null);
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

// Comprobar si está autenticado lo lanzamos nada más cargar el store y se carga antes de la instancia de Vue
// Se queda residente en memoria por si acaso.
store.dispatch('checkAuth');

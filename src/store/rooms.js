/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import Rooms from '../services/Firebase/Room';
import Service from '../services/Firebase/index';

/**
 * Estado para Salas
 */

/**
* Los servicios en tiempo real hay que tocarlos en el estado directamente
*/

const state = {
  rooms: [],
};

const getters = {};

const mutations = {
  /**
   * Actualiza el estado
   * @param {state} state
   * @param {[]} rooms
   */
  setRooms(state, rooms) {
    state.rooms = rooms;
    // console.log(state.rooms);
  },
};

const actions = {
  // Usamos rootState porque es la pieza raiz o no las traemos de otro lado.
  /**
   * Crea una habitacion
   * @param {state} estado raíz, el padre para acceder a otros
   * @param {*} nombre y descripción de la sala
   */
  async roomsCreate({ rootState }, { name, description }) {
    const { uid, displayName } = rootState.user.user;
    Rooms.createRoom({
      name, description, uid, displayName,
    });
  },

  /**
   * Obtiene todas las salas. Los cambios en tiempo real deben ir en el estado.
   * @param {state} commit
   */
  async getRooms({ commit }) {
    // Ponemos true porque estamos diciendo que pertenece al módulo global
    const query = Service.roomsCollection.orderBy('createdAt', 'desc');
    // Nos suscribimos a eventos de tiempo real, detectando una instantátea del cambio
    query.onSnapshot((querySnapshot) => {
      const rooms = [];
      // Indicamos que este método es del módulo raiz
      commit('setLoading', true, { root: true });
      // Por cada documento
      querySnapshot.forEach((doc) => {
        const room = doc.data();
        room.id = doc.id;
        rooms.push(room);
      });
      commit('setLoading', false, { root: true });
      commit('setRooms', rooms);
    });
  },

};

export default {
  // Importante namespace para evitar problemas de importanción
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

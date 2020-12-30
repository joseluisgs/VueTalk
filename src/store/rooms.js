import Rooms from '../services/Firebase/Room';

// Modelos de salas
const state = {
  room: [],
};

const getters = {};

const mutations = {};

const actions = {
  // Usamos rootState porque es la pieza raiz o no las traemos de otro lado.
  /**
   * Crea una habitacion
   * @param {state} estado raíz, el padre para acceder a otros
   * @param {*} nombre y descripción de la sala
   */
  async roomsCreate({ rootState }, { name, description }) {
    const userUID = rootState.user.user.uid;
    Rooms.createRoom({ name, description, userUID });
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

/* eslint-disable no-param-reassign */
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
  roomsListener: () => { }, // Para activar o desactivar los evento de escucha
};

const getters = {
  /**
   * Devuelve del estado la sala con el id que le indicamos
   * @param {state} state
   */
  getRoom: (state) => (id) => state.rooms.find((room) => room.id === id),
};

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

  // Para no cargar todo los elementos creamos una serie de métodos para actuar dependiendo
  // del cambio en tiempo real
  // https://firebase.google.com/docs/firestore/query-data/listen#node.js_4

  /**
   * Crea una sala
   * @param {*} state
   * @param {*} room
   */
  createRoom(state, { roomData, id }) {
    roomData.id = id;
    state.rooms.unshift(roomData);
  },

  /**
   * Actualiza una sala
   * @param {*} state
   * @param {*} room
   */
  // He quitado de parámetro index, porque siempre entregaba cero
  updateRoom(state, { roomData, id }) {
    // index no funciona, porque devuelve siempre 0, por eso hay que buscar por el ID de la sala
    roomData.id = id;
    // Obtenemos la información
    const indice = state.rooms.find((room) => room.id === id);
    state.rooms[indice] = roomData; //   state.rooms[index] = roomData;
  },

  /**
   * Elimina una sala
   * @param {*} state
   * @param {*} index
   */
  removeRoom(state, index) {
    state.rooms.splice(index, 1);
  },

  /**
   * Activa o desactiva el evento de escucha
   * @param {*} state
   * @param {*} listener
   */
  setRoomsListener(state, listener) {
    if (listener) {
      // Si está le asignamos la copia
      state.roomsListener = listener;
    } else {
      // si no está, nos desuscribimos, función vacía.
      state.roomsListener();
    }
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
   * Debemos detectar el cambio para no operar con todo el conjunto de datos
   * https://firebase.google.com/docs/firestore/query-data/listen#node.js_4
   * @param {state} commit
   */
  async getRooms({ commit }) {
    // Ponemos true porque estamos diciendo que pertenece al módulo global
    /* const query = Service.roomsCollection.orderBy('createdAt', 'desc');
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
    }); */

    // Analizando los tipos de cambios dependiendo de la actualización a realizar soebre los documentos
    const query = Service.roomsCollection.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
      commit('setRoomsListener', query);
      commit('setLoading', true, { root: true });
      querySnapshot.docChanges().forEach((change) => {
        // El cambio es añadir un nuevo elemento: sala
        if (change.type === 'added') {
          console.log('--> added');
          commit('createRoom', {
            roomData: change.doc.data(),
            id: change.doc.id,
          });
        // El cambio es actualizar un elemento: sala
        } else if (change.type === 'modified') {
          console.log('--> modified');
          commit('updateRoom', {
            // index: change.newIndex, // Este es el indice que queremos modificar, pero falla siempre devuelve cero
            roomData: change.doc.data(),
            id: change.doc.id,
          });
        // El cambio es eliminar un elemento: sala
        } else if (change.type === 'removed') {
          console.log('--> removed');
          commit('removeRoom', change.oldIndex);
        }
        commit('setLoading', false, { root: true });
      });
    });
  },

  /**
   * Obtiene una sala dado un ID
   * @param {context} context
   * @param {string} roomID
   */
  async getRoomByID(context, roomID) {
    return Rooms.getRoom(roomID);
  },

  /**
   * actualiza los datos de una sala
   * @param {context} context
   * @param {room} room data
   */
  async roomUpdate(context, { roomID, name, description }) {
    return Rooms.updateRoom({ roomID, name, description });
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

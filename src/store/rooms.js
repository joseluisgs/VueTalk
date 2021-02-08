/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import Rooms from '../services/Firebase/Room';
import Service from '../services/Firebase/index';
import Storage from '../services/Firebase/Storage';

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
  /**
   * Devuelve las salas ordenadas por fecha descedente
   * @param {*} state
   */
  roomsByDate: (state) => state.rooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

  // Devuelve la imagen de una sala
  roomImage: (state) => (id) => {
    const room = state.rooms.find((room) => room.id === id);
    return room.image ? room.image : require('@/assets/img/chat-room.png');
  },

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
    // Primero debemos buscar que no exista
    roomData.id = id;
    const room = state.rooms.find((room) => room.id === id);
    if (!room) {
      state.rooms.push(roomData);
    }
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
    const indice = state.rooms.findIndex((room) => room.id === id);
    if (indice !== -1) {
      state.rooms[indice] = roomData; //   state.rooms[index] = roomData;
    }
  },

  /**
   * Elimina una sala
   * @param {*} state
   * @param {*} index
   */
  removeRoom(state, id) {
    // Obtenemos la información
    const indice = state.rooms.findIndex((room) => room.id === id);
    if (indice !== -1) {
      state.rooms.splice(indice, 1);
    }
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
   * @param {*} nombre, descripción, magen e id de la sala
   */
  async roomsCreate({ rootState }, {
    name, description, image, roomID,
  }) {
    const { uid, displayName } = rootState.user.user;
    Rooms.createRoom({
      name, description, image, roomID, uid, displayName,
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
      // Aceptamos y nos suscribiemos a los cambios
      commit('setRoomsListener', query);
      commit('setLoading', true, { root: true });
      querySnapshot.docChanges().forEach((change) => {
        // El cambio es añadir un nuevo elemento: sala
        if (change.type === 'added') {
          console.log('Change --> added');
          commit('createRoom', {
            roomData: change.doc.data(),
            id: change.doc.id,
          });
        // El cambio es actualizar un elemento: sala
        } else if (change.type === 'modified') {
          console.log('Change --> modified');
          commit('updateRoom', {
            // index: change.newIndex, // Este es el indice que queremos modificar, pero falla siempre devuelve cero
            roomData: change.doc.data(),
            id: change.doc.id,
          });
        // El cambio es eliminar un elemento: sala
        } else if (change.type === 'removed') {
          console.log('Change --> removed');
          commit('removeRoom', change.doc.id);
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
  // async getRoomByID(context, roomID) {
  //   return Rooms.getRoom(roomID);
  // },

  /**
   * actualiza los datos de una sala
   * @param {context} context
   * @param {room} room data
   */
  async roomUpdate(context, { roomID, name, description }) {
    return Rooms.updateRoom({ roomID, name, description });
  },

  /**
   * Obtiene una sala a partir de un ID
   * Primero busca en el estado
   * Si no en Firebase Firestore
   * @param {*} param0
   * @param {*} roomID
   */
  async getRoomByID({ getters }, roomID) {
    // Grab from local state
    let room = getters.getRoom(roomID);
    if (!room) {
      // Grab from Cloud Firestore 🔥
      room = await Rooms.getRoom(roomID);
      if (!room) throw new Error('Could not find room');
    }
    return room;
  },

  /**
   * Elimina una sala y sus mensajes
   */
  async roomRemove(context, roomID) {
    const room = await Service.roomsCollection.doc(roomID);
    const roomData = await (await room.get()).data();
    const userData = await Service.auth.currentUser;
    // si depende del administrador de firestore me fallaba
    if (roomData.adminUid === userData.uid) {
      // Borramos todos los documentos
      const messages = await room.collection('messages').onSnapshot(async (querySnapshot) => {
        await querySnapshot.docs.forEach(async (doc) => {
          await room
            .collection('messages')
            .doc(doc.id)
            .delete();
        });
        messages(); // Unsub
      });
      // Borramos la sala
      await room.delete();
    } else {
      throw new Error('User is not admin of this room');
    }
  },

  /**
   * Devuelve el ID de un nuevo documento
   */
  async getNewRoomId() {
    return Rooms.getNewId();
  },

  /**
   * Sube una imagen al storage
   * @param {*} context
   * @param {*} elementos a lamcenar
   */
  async uploadRoomImage(context, { roomID, file }) {
    return Storage.uploadRoomImage(roomID, file);
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

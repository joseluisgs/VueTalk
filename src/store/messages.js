/* eslint-disable no-param-reassign */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import Service from '../services/Firebase/index';
import Message from '../services/Firebase/Message';
import Storage from '../services/Firebase/Storage';

// Modelos de mensajes
const state = {
  messages: [],
  messagesListener: () => { }, // Para activar o desactivar los evento de escucha
  // Filtros graficos de imagenes
  filters: [
    { name: 'normal' },
    { name: 'clarendon' },
    { name: 'gingham' },
    { name: 'moon' },
    { name: 'lark' },
    { name: 'reyes' },
    { name: 'juno' },
    { name: 'slumber' },
    { name: 'aden' },
    { name: 'perpetua' },
    { name: 'mayfair' },
    { name: 'rise' },
    { name: 'hudson' },
    { name: 'valencia' },
    { name: 'xpro2' },
    { name: 'willow' },
    { name: 'lofi' },
    { name: 'inkwell' },
    { name: 'nashville' },
  ],
};

const getters = {};

const mutations = {
  /**
   * Asigna los mensajes
   * @param {state} state
   * @param {messages} messages
   */
  setMessages(state, messages) {
    state.messages = messages;
  },

  /**
   * Activa o descativa el listener para esuchar cambios en segundo plano contínuamente
   * @param {state} state
   * @param {listener} listener
   */
  setMessagesListener(state, listener) {
    if (listener) {
      state.listener = listener;
    } else {
      state.messagesListener();
    }
  },
};

const actions = {
  /**
   * Obtiene los mensajes de una sala en tiempo real y nos desuscribimos de ellos
   * @param {state} commit
   */
  async getMessages({ commit }) {
    // Nos traemos todos los mensajes
    const query = Service.db.collectionGroup('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(((querySnapshot) => {
        // Aceptamos y nos ssuscribimos a los cambios
        commit('setMessagesListener', query);
        commit('setLoading', true, { root: true });
        const messages = [];
        // Para cada mensaje recibido, lo recuperamos y le asignamos una id
        querySnapshot.forEach((doc) => {
          const message = doc.data();
          message.id = doc.id;
          messages.unshift(message);
        });
        commit('setMessages', messages);
        commit('setLoading', false, { root: true });
      }));
  },

  /**
   * Envía y almacena un mensaje y sus datos de una sala
   * @param {rootState} rootState
   * @param {message} message
   */
  async messageCreate({ rootState }, {
    roomID, message, photo, filter,
  }) {
    return Message.createMessage(
      {
        userId: rootState.user.user.uid,
        userName: rootState.user.user.displayName,
        roomId: roomID,
        message,
        photo,
        filter,
        createdAt: Date.now(),
      },
    );
  },

  /**
   * Sube una imagen al storage
   * @param {*} context
   * @param {*} elementos a lamcenar
   */
  async uploadMessageImage({ rootGetters }, { roomID, file }) {
    // Obtenemos el UID del usuario usando su getter
    const userUID = rootGetters['user/getUserUid'];
    return Storage.uploadMessageImage(roomID, userUID, file);
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

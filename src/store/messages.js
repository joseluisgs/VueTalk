/* eslint-disable no-param-reassign */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import Service from '../services/Firebase/index';
import Message from '../services/Firebase/Message';

// Modelos de mensajes
const state = {
  messages: [],
  messagesListener: () => { }, // Para activar o desactivar los evento de escucha
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
   * @param {string} roomID
   */
  async getMessages({ commit }, roomID) {
    const query = Service.roomsCollection.doc(roomID).collection('messages')
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
  async messageCreate({ rootState }, { roomID, message }) {
    return Message.createMessage(
      {
        roomID,
        userId: rootState.user.user.uid,
        userName: rootState.user.user.displayName,
        message,
        createdAt: Date.now(),
      },
    );
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

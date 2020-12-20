/**
 * Estado para Usuario
 */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import Auth from '../services/Firebase/Auth';
import User from '../services/Firebase/User';

const state = {
  user: null,
};

const getters = {};

// Las mutaciones actúan y modifican el estado
const mutations = {
  /**
   * Añade el usuario al estado
   * @param {state} state
   * @param {user} user
   */
  setUser(state, user) {
    state.user = user;
    console.log(user);
  },
};

// Las accioens realizan cambios asíncronos en el estado
// Ideal para el uso de servicios como Firebase o Apis Rest
const actions = {
  // Desestructuramos porque lo que queremos es llamar solo a la mutación
  // En el caso de usuario solo le pasamos el
  // Podrían ser variables sueltas, pero mejor así

  /**
   * Realiza el login
   * @param {state} state
   * @param {string} email
   * @param {string} password
   */
  async userLogin({ commit }, { email, password }) {
    // Hacemos el login
    const user = await Auth.login(email, password);
    // Si todo va bien actualizamos el estado con su mutación
    commit('setUser', user);
  },

  /**
   * Realiza el registro
   * @param {state} state
   * @param {string} email
   * @param {string} password
   */
  async userRegister({ commit }, { name, email, password }) {
    // Registramos
    const user = await Auth.register(email, password);
    // Si todo va bien obtenemos el Usuario y cambiamos su perfil
    await User.updateProfile(user, {
      displayName: name,
    });
    commit('setUser', user);
  },

  /**
   * Realiza el logout
   * @param {state} state
   */
  async userLogout({ commit }) {
    await Auth.logout();
    commit('setUser', null);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

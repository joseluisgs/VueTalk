/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import Auth from '../services/Firebase/Auth';
import User from '../services/Firebase/User';
import Service from '../services/Firebase/index';

/**
* Los servicios en tiempo real hay que tocarlos en el estado directamente
*/

const state = {
  user: null,
};

const getters = {
  // Devuelve el uid del usuario
  getUserUid(state) {
    return state.user.uid;
  },
};

// Las mutaciones actúan y modifican el estado
const mutations = {
  /**
   * Añade el usuario al estado
   * @param {state} state
   * @param {user} user
   */
  setUser(state, user) {
    state.user = user;
    // console.log(user);
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

  /**
   * Actualiza el perfil del usuario
   * @param {context} { state, commit }
   * @param {user} { name, email, password }
   */
  async profileUpdate({ commit }, { name, email, password }) {
    const user = await Auth.getActiveUser();
    // si nos llegan los cambios
    if (name) {
      await User.updateProfile(user, {
        displayName: name,
      });
      // Si cabiamos el nombre vamos a realizar una transacción para cambiarlo en todos lados
      Service.db.runTransaction(async (transaction) => {
        // Cogemos todos los grupos de mensajes
        // De esta manera nos ahorramos iterar por cara uno de los mensajes de cada una de las salas.
        // De esta manera lo hacemos del tiron
        // https://firebase.google.com/docs/firestore/manage-data/transactions
        // https://firebase.googleblog.com/2019/06/understanding-collection-group-queries.html
        // https://firebase.google.com/docs/firestore/query-data/queries
        const query = await Service.db
          .collectionGroup('messages')
          .where('userId', '==', state.user.uid)
          .get();

        query.forEach((doc) => {
          transaction.update(doc.ref, { userName: name });
        });
      });
    }

    if (email) {
      await User.updateEmail(user, email);
    }

    if (password) {
      await User.updatePassword(user, password);
    }

    // Actualizamos los cambios en el store
    commit('setUser', user);
  },

  /**
   * Obtiene el usuario Actual y resolvemos la promesa
   */
  async getCurrentUser() {
    // Lo que hacemos es detectar los cambios en tiempo real
    return new Promise((resolve, reject) => {
      const unsubscribe = Service.auth.onAuthStateChanged(
        // Si tenemos usuario, resolvemos la promesa y lo retornamos
        (user) => {
          unsubscribe();
          resolve(user);
        },
        // Rechazamos
        () => {
          reject();
        },
      );
    });
  },

  /**
   * Actualiza el password dado un mail
   * @param {string} email
   */
  async resetPassword(context, email) {
    return Auth.reset(email);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import Auth from '../services/Firebase/Auth';
import User from '../services/Firebase/User';
import Service from '../services/Firebase/index';

/**
* Los servicios en tiempo real hay que tocarlos en el estado directamente
*/

const state = {
  user: null,
  meta: {}, // Metadatos sobre el usuario y su conexión
  userListener: () => { }, // listener de conexión en tiempo real
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

  /**
   * Establece el meta del usuario
   * @param {*} state
   * @param {*} meta
   */
  setMeta(state, meta) {
    // console.log(meta);
    state.meta = meta;
  },

  /**
   * Activa o descativa el listener de tiempo real
   * @param {} state
   * @param {*} listener
   */
  setUserListener(state, listener) {
    if (listener) {
      state.userListener = listener;
    } else {
      state.userListener();
    }
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
    // Creamos el usuario en la base de datos
    // Podemos meterle todos los campso qque queramos
    const data = { name, email, created: Date.now() };
    await User.createUser(user.uid, data);
    commit('setUser', user);
  },

  /**
   * Realiza el logout
   * @param {state} state
   */
  async userLogout() {
    await Auth.logout();
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

  /**
   * Actualiza los metadata de un usuario
   * @param {} context
   * @param {*} param1
   */
  async updateMeta(context, { roomID, exit, uid }) {
    const ref = Service.usersCollection.doc(uid);
    const userDoc = await ref.get();
    // si no existe lo creamos en blanco para qe haya datos en blancos.
    if (!userDoc.exists) await ref.set({});
    // Dpendiendo de si existe añadimos o mezclamos
    const method = exit ? 'arrayRemove' : 'arrayUnion';
    // Actualizamos según el métodos: https://firebase.google.com/docs/firestore/manage-data/add-data
    // Añadimos que se conecte y el id de la sala y actualizamos la fecha de cnexión de la misma
    // estamos creado dos compos, en connected va la sala a la que se inscrito (es una array)
    // en joined va una marca de tiempo de la última vez que entró al indice de la sala en cuestión, por eso es Objeto {romID: timestamp}
    await ref.update({
      connected: Service.firebase.firestore.FieldValue[method](roomID),
      [`joined.${roomID}`]: Date.now(),
    });
  },

  /**
   * Llevamos el control en tiempo real
   * @param {*} param0
   */
  async getMeta({ state, commit }) {
    // buescamos el usuario. Si lo has creado no tiene metadatos.
    const ref = await Service.usersCollection.doc(state.user.uid);
    // Perdo debe existir el usuario o simplemente al crear no de errores.
    // Actualizamos a vacío de primeras pr si hemos cerrado sin querer el navegador
    if (await (await ref.get()).exists) {
      await ref.update({ connected: [] });
    }
    // eslint-disable-next-line no-use-before-define
    const query = await ref.onSnapshot(async (doc) => {
      commit('setUserListener', query);
      commit('setMeta', doc.data());
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

import Service from '.';

// Recurso
const Auth = Service.auth;

// Operaciones
export default {

  /**
   * Devuelve el usuario activo
   * @returns {user} Objeto User Google Auth
   */
  async getActiveUser() {
    return Service.currentUser;
  },

  /**
   * Realiza el login con Google: https://firebase.google.com/docs/auth/web/google-signin?hl=es_419
   * @returns {user} Objeto User Google Auth
   */
  async loginGoogle() {
    const res = await Auth.signInWithPopup(Service.providerGoogle);
    return res.user;
  },

  /**
   * Realiza el logout: https://firebase.google.com/docs/auth/web/password-auth?hl=es_419
   */
  async logout() {
    return Auth.signOut();
  },

  /**
   * Realiza el logín en base a un email y un password
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const res = await Auth.signInWithEmailAndPassword(email, password);
    return res.user;
  },

  /**
   * Realiza el registro de un usuario en base a un email y password
   * @param {string} email
   * @param {string} password
   */
  async register(email, password) {
    const res = await Auth.createUserWithEmailAndPassword(email, password);
    return res.user;
  },

  /**
   * Recupera al password dado un email
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#sendpasswordresetemail
   * @param {string} email
   */
  async reset(email) {
    return Auth.sendPasswordResetEmail(email);
  },
};

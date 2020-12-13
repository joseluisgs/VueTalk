import Service from '.';

// Recurso
const Auth = Service.auth;

// Operaciones
export default {
  // devuelve el usuario actual
  getUsuarioActivo() {
    return Auth.currentUser;
  },

  // Realiza el login con Google
  // https://firebase.google.com/docs/auth/web/google-signin?hl=es_419
  async loginGoogle() {
    const res = await Auth.signInWithPopup(Service.providerGoogle);
    return res.user;
  },

  // Realiza el logout
  // https://firebase.google.com/docs/auth/web/password-auth?hl=es_419
  async logout() {
    return Auth.signOut();
  },

};

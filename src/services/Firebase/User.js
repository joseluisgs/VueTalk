import Service from '.';

export default {

  /**
   * Actualiza el perfil de usuario
   * @param {user} user
   * @param {profile} profile
   */
  async updateProfile(user, profile) {
    await user.updateProfile(profile);
  },

  /**
   * Actualiza el email del usuario
   * @param {user} user
   * @param {string} email
   */
  async updateEmail(user, email) {
    await user.updateEmail(email);
  },

  /**
   * Actualiza el password del usuario
   * @param {user} user
   * @param {string} password
   */
  async updatePassword(user, password) {
    await user.updatePassword(password);
  },

  /**
   * crea un usuario en la base de datos
   * @param {string} id
   * @param {any} data
   */
  async createUser(id, data) {
    return Service.usersCollection.doc(id).set(data, { merge: true });
  },

  /**
   * Devuelve un usuario dado su id
   * @param {*} id
   */
  async getUser(id) {
    return Service.usersCollection.doc(id).get();
  },
};

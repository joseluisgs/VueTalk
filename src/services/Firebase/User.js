export default {

  /**
   * Actualiza el perfil de usuario
   * @param {user} user
   * @param {profile} profile
   */
  async updateProfile(user, profile) {
    await user.updateProfile(profile);
  },
};

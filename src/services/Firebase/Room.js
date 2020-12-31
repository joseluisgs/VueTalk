import Service from './index';

export default {
  /**
   * Crea una sala
   * @param {*} Objeto con los datos de nombre, descripción y usuario de la sala
   */
  async createRoom({
    name, description, uid, displayName,
  }) {
    return Service.roomsCollection.add({
      name,
      description,
      createdAt: Date.now(),
      adminUid: uid,
      adminName: displayName,
    });
  },
};

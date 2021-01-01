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

  /**
   * Devuelve una sala con el id indicado
   * @param {string} roomID
   */
  async getRoom(roomID) {
    return (await Service.roomsCollection.doc(roomID).get()).data();
  },

  /**
   * Actualiza los datos de una sala
   * @param {room} room data
   */
  async updateRoom({ roomID, name, description }) {
    const roomData = {};
    if (name) roomData.name = name;
    if (description) roomData.description = description;
    return Service.roomsCollection.doc(roomID).update(roomData);
  },

};

import Service from './index';

export default {
  /**
   * Crea una sala
   * @param {*} Objeto con los datos de nombre, descripción y usuario de la sala
   */
  async createRoom({
    name, description, image, roomID, uid, displayName,
  }) {
    return Service.roomsCollection.doc(roomID).set({
      name,
      description,
      createdAt: Date.now(),
      adminUid: uid,
      adminName: displayName,
      image,
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
  async updateRoom({
    roomID, name, description, image,
  }) {
    const roomData = {};
    if (name) roomData.name = name;
    if (description) roomData.description = description;
    roomData.image = image;
    return Service.roomsCollection.doc(roomID).update(roomData);
  },

  /**
   * Devuelve el id nuevo
   */
  async getNewId() {
    const room = await Service.roomsCollection.doc();
    return room.id;
  },

};

import Service from './index';

export default {
  /**
   * Crea un nuevo mensaje con los datos y el usuario indicado
   * @param {*} message Dato del mensaje
   */
  async createMessage({
    roomId, userId, userName, message, photo, filter,
  }) {
    return Service.roomsCollection.doc(roomId).collection('messages')
      .add({
        userId,
        userName,
        message,
        photo,
        filter,
        roomId,
        createdAt: Date.now(),
      });
  },
};

import Service from './index';

export default {
  /**
   * Crea un nuevo mensaje con los datos y el usuario indicado
   * @param {*} message Dato del mensaje
   */
  async createMessage({
    roomID, userId, userName, message,
  }) {
    return Service.roomsCollection.doc(roomID).collection('messages')
      .add({
        userId,
        userName,
        message,
        createdAt: Date.now(),
      });
  },
};

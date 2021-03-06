import Service from './index';

export default {
  /**
   * Crea un nuevo mensaje con los datos y el usuario indicado
   * @param {*} message Dato del mensaje
   */
  async createMessage({
    roomId, userId, userName, message, photo, filter, audio,
  }) {
    return Service.roomsCollection.doc(roomId).collection('messages')
      .add({
        userId,
        userName,
        message,
        photo,
        filter,
        audio,
        roomId,
        createdAt: Date.now(),
      });
  },

  /**
   * Elimina de una sala determinada un mensaje determinado
   * @param {*} roomID
   * @param {*} messageID
   */
  async deleteMessage(roomID, messageID) {
    await Service.roomsCollection
      .doc(roomID)
      .collection('messages')
      .doc(messageID)
      .delete();
  },
};

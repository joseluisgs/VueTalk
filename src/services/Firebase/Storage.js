import Service from './index';

// Recurso
const { roomsStorage } = Service;

// Operaciones
export default {
  /**
   * Sube la imagen de una sala
   * @param {*} roomID
   * @param {*} file
   */
  async uploadRoomImage(roomID, file) {
    // Función que sube la foto
    const uploadPhoto = () => {
      // Creamos el nombre y path del fichero
      const fileName = `${roomID}/${roomID}-image.jpg`;
      const fileRef = roomsStorage.child(fileName);
      return fileRef.put(file);
    };

    // Obtenemos la url
    const fileURL = (ref) => ref.getDownloadURL();

    // Método a usar para subir la imagen y obtener su URL
    try {
      const upload = await uploadPhoto();
      return await fileURL(upload.ref);
    } catch (error) {
      throw Error(error.message);
    }
  },

};

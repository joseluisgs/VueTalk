import Service from './index';

// Recurso
const { roomsStorage, urlStorage } = Service;

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

  /**
   * Elimina todas los ficheros de una sala
   * @param {*} roomID
   */
  async removeRoomFiles(roomID) {
    // Borramos todo lo que tiene la sala contenido
    try {
      const dirRef = roomsStorage.child(roomID);
      // Obtenemos la lista
      const files = await dirRef.list();
      files.items.forEach((fileRef) => {
        // Lo borramos
        fileRef.delete();
      });
      // throw Error('Prueba');
      // dirRef.delete();
    } catch (error) {
      throw Error(error.message);
    }
  },

  /**
   * Sube ficheros de mensajes sociados  una sala
   * @param {*} roomID
   * @param {*} file
   */
  async uploadMessageFile(roomID, userUID, file, ext) {
    // Función que sube el fichero
    const timestamp = Date.now();
    const uploadFile = () => {
      // Creamos el nombre y path del fichero y su extensión
      const fileName = `${roomID}/messages/${userUID}-${timestamp}.${ext}`;
      const fileRef = roomsStorage.child(fileName);
      return fileRef.put(file);
    };

    // Obtenemos la url
    const fileURL = (ref) => ref.getDownloadURL();

    // Método a usar para subir la imagen y obtener su URL
    try {
      const upload = await uploadFile();
      return await fileURL(upload.ref);
    } catch (error) {
      throw Error(error.message);
    }
  },

  /**
   * Borra un mensaje desde almacenamiento
   * @param {*} file
   */
  async deleteMessageFile(file) {
    try {
      // Obtenemos la referencia del fichero de manera inversa, es decir, en base a su URL
      const fileRef = urlStorage.refFromURL(file);
      return await fileRef.delete();
    } catch (error) {
      throw Error(error.message);
    }
  },

};

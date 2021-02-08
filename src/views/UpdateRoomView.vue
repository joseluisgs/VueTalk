<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title has-text-centered">Edit Room</h1>
          <!-- Room form -->
          <form v-if="room" @submit.prevent="updateRoom">
            <b-field label="Name" position="is-left">
                <b-input
                  placeholder="room.name"
                  type="text"
                  v-model.trim="room.name"
                  icon="chat-processing"
                  key="room-update-name-input"
                   minlength="3"
                ></b-input>
            </b-field>

            <b-field label="Description" position="is-left">
              <p class="control has-icons-left has-icons-right">
                <b-input
                  placeholder="room.description"
                  required
                  type="textarea"
                  maxlength="200"
                  v-model.trim="room.description"
                  key="room-update-description-input"
                  minlength="3"
                ></b-input>
                <!-- <span class="icon is-small is-left">
                  <i class="fas fa-info-circle"></i>
                </span> -->
              </p>
            </b-field>
             <!-- Fichero -->
            <label class="label">Image</label>
            <div
              class="room__image"
              :style="{
                'background-image': `url(${roomImage})`,
              }"
            >
              <!-- Para borrar la imagen -->
              <a
                href="#"
                v-if="imageURL"
                @click.prevent="removeImage"
                class="is-pulled-right button is-small is-danger is-outlined"
                >X</a
              >
            </div>
            <b-field class="file is-primary" :class="{ 'has-name': !!image }">
              <b-upload
                v-model="image"
                accept="image/jpeg, image/png, image/gif"
                class="file-label"
                @input="onFileChange"
              >
                <span class="file-cta">
                  <b-icon class="file-icon" icon="upload"></b-icon>
                  <span class="file-label">Choose a image</span>
                </span>
                <span class="file-name" v-if="image">
                  {{ image.name }}
                </span>
              </b-upload>
            </b-field>
            <!-- Botones de enviar -->
            <div class="field is-grouped is-grouped-right">
              <div class="buttons">
                <b-button
                  type="is-link"
                  native-type="submit"
                  :disabled="!hasDataChanged"
                  :loading="isLoading"
                  icon-left="pencil"
                >
                  Update
                </b-button>
                <b-button
                  type="is-danger"
                  :loading="isLoading"
                  icon-left="delete"
                  @click="removeRoom"
                >
                  Delete
                </b-button>
              </div>
            </div>
          </form>
          <!-- End of room form -->
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'UpdateRoom',

  // Modelo de datos
  data: () => ({
    isLoading: false,
    room: null,
    image: null,
    imageURL: null,
  }),

  // Mis propiedades
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  // Ciclo del vida
  /**
   * Al crearme compruebo que existo en varios lugares,
   * ya sea en mi estado Vuex, o en firebase
   */
  async created() {
    try {
      this.room = await this.getRoomByID(this.id);
      // Asignamos la imagen sea la que sea
      this.imageURL = this.room.image;
    } catch (error) {
      console.error(error.message);
      this.toast({ message: error.message, type: 'is-danger' });
      // Empujamos al home si no existe en ningún lado
      this.$router.push({ name: 'Home' });
    }
  },

  // Mis métodos
  methods: {
    // De vuex
    ...mapActions('rooms', ['roomUpdate', 'getRoomByID', 'roomRemove', 'uploadRoomImage', 'removeRoomImages']),
    ...mapActions('utils', ['toast', 'confirm']),
    // Míos
    /**
     * Actualiza una Sala
     */
    async updateRoom() {
      this.isLoading = true;
      // Si hay una imagen
      if (this.image) {
        this.imageURL = await this.uploadRoomImage({
          file: this.image,
          roomID: this.id,
        });
      }

      try {
        await this.roomUpdate({
          roomID: this.id,
          name: this.room.name,
          description: this.room.description,
          image: this.imageURL,
        });
        this.toast({ message: 'Room data updated', type: 'is-success' });
        this.redirect();
      } catch (error) {
        console.error(error.message);
        this.toast({ message: error.message, type: 'is-danger' });
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Elimina una sala y sus mensajes
     */
    async removeRoom() {
      this.isLoading = true;
      try {
        const res = await this.confirm({
          title: 'Deleting account',
          message: 'Are you sure you want to <b>delete</b> this room and messages? This action cannot be undone.',
          confirmText: 'Delete Room',
          type: 'is-danger',
        });
        if (res) {
          // Borramos las imagenes contenidas
          await this.removeRoomImages(this.id);
          // Borramos los datos de la sala y sus mensajes
          await this.roomRemove(this.id);
          this.toast({ message: 'Room removed', type: 'is-success' });
          this.redirect();
        }
      } catch (error) {
        console.error(error.message);
        this.toast({ message: error.message, type: 'is-danger' });
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Redirecciona los datos
     */
    redirect() {
      setTimeout(() => this.$router.push({ name: 'Home' }), 1000);
    },

    /**
     * Comprueba alguna longitud de datos
     */
    checkData() {
      return this.room.name.name.length > 3 && this.room.name.description.length > 3;
    },

    /**
     * Detecta cambios a la subida del fichero
     */
    onFileChange() {
      this.imageURL = URL.createObjectURL(this.image);
    },

    removeImage() {
      this.image = null;
      // si queremos eliminar cualquier imagen
      this.imageURL = null;
      // Si queremos volver a la imagen anterior
      // this.imageURL = this.room.image;
    },
  },

  computed: {
    ...mapGetters('rooms', ['getRoom']),
    /**
     * Comprueba que haya cambios en los dos campos
     */
    hasDataChanged() {
      return this.room.name.length >= 3 && this.room.description.length >= 3;
    },
    /**
     * Si hay imagen, creamos una URL del objeto subido
     * Si no obtenemos la imagen pro defecto
     */
    roomImage() {
      return this.imageURL
        ? this.imageURL
        // eslint-disable-next-line global-require
        : require('@/assets/img/chat-room.png');
    },
  },
};
</script>

<style lang="scss" scoped>
.room__image {
  height: 20vmax;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid;
  background-size: cover;
  background-position: center;
}
</style>

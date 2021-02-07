<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title has-text-centered">Create Room</h1>

          <form @submit.prevent="createRoom">
            <b-field label="Name" position="is-left">
              <b-input
                placeholder="e.g. Black Cat mania 😼"
                required
                type="text"
                v-model.trim="roomData.name"
                key="room-create-name-input"
                icon="chat-processing-outline"
                minlength="3"
              ></b-input>
            </b-field>

            <b-field label="Description" position="is-left">
              <b-input
                placeholder="e.g. Let's talk about why Black Cat's are fucking awesome"
                required
                type="textarea"
                maxlength="200"
                v-model.trim="roomData.description"
                key="room-create-description-input"
                minlength="3"
              ></b-input>
            </b-field>

            <div class="field is-grouped has-text-right">
              <div class="buttons">
                <b-button
                  type="is-link"
                  native-type="submit"
                  :disabled="!hasDataChanged"
                  :loading="isLoading"
                  icon-left="chat-plus"
                  >Create
                </b-button>
              </div>
            </div>
            <!-- Fichero -->
            <label class="label">Image</label>
              <div
                class="room__image"
                :style="{
                  'background-image': `url(${roomImage})`
                }"
              >
              <!-- Para borrar la imagen -->
              <a
                    href="#"
                    v-if="image"
                    @click.prevent="image = roomData.imageURL = null"
                    class="is-pulled-right button is-small is-danger is-outlined"
                    >X</a
                  >
              </div>
            <b-field class="file is-primary" :class="{ 'has-name': !!image }">
              <b-upload v-model="image"
                accept="image/jpeg, image/png, image/gif"
                class="file-label">
                <span class="file-cta">
                  <b-icon class="file-icon" icon="upload"></b-icon>
                  <span class="file-label">Choose a image</span>
                </span>
                <span class="file-name" v-if="image">
                  {{ image.name }}
                </span>
              </b-upload>
            </b-field>
          </form>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'CreateRoomView',
  // Modelo de datos
  data: () => ({
    isLoading: false,
    image: null,
    roomData: {
      name: '',
      description: '',
      imageURL: '',
    },
  }),
  // Metodos
  methods: {
    // De vuex
    ...mapActions('rooms', ['roomsCreate', 'getNewRoomId', 'uploadRoomImage']),
    ...mapActions('utils', ['toast']),
    // Míos

    /**
     * Crea una sala
     */
    async createRoom() {
      this.isLoading = true;
      try {
        // Obtenemos el id de la room
        const roomID = await this.getNewRoomId();

        // Si hay una imagen
        if (this.image) {
          this.imageURL = await this.uploadRoomImage({
            file: this.image,
            roomID,
          });
        }

        await this.roomsCreate({
          name: this.roomData.name,
          description: this.roomData.description,
          image: this.imageURL,
          roomID,
        });
        this.toast({ message: 'Room created', type: 'is-success' });
        this.resetData();
        this.redirect();
      } catch (error) {
        console.error(error.message);
        this.toast({ message: error.message, type: 'is-danger' });
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Limpia los datos
     */
    resetData() {
      this.roomData.name = '';
      this.roomData.description = '';
      this.roomData.imageURL = '';
    },

    /**
     * Redirecciona los datos
     */
    redirect() {
      setTimeout(() => this.$router.push({ name: 'Home' }), 1000);
    },
  },
  computed: {
    /**
     * Si ha cambiado algún dato del formulario
     */
    hasDataChanged() {
      return this.roomData.name.length >= 3 && this.roomData.description.length >= 3;
    },

    /**
     * Si hay imagen, creamos una URL del objeto subido
     * Si no obtenemos la imagen pro defecto
     */
    roomImage() {
      return this.image
        ? URL.createObjectURL(this.image)
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

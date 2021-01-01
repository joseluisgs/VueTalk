<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title has-text-centered">Edit Room</h1>
          <!-- Room form -->
          <form v-if="room" @submit.prevent="updateRoom">
            <b-field label="Name" position="is-left">
              <p class="control has-icons-left has-icons-right">
                <b-input
                  placeholder="room.name"
                  type="text"
                  v-model.trim="room.name"
                  key="room-update-name-input"
                ></b-input>
                <span class="icon is-small is-left">
                  <i class="fab fa-forumbee"></i>
                </span>
              </p>
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
                ></b-input>
                <!-- <span class="icon is-small is-left">
                  <i class="fas fa-info-circle"></i>
                </span> -->
              </p>
            </b-field>

            <div class="field is-grouped is-grouped-right">
              <div class="buttons">
                <b-button
                  tag="input"
                  type="is-link"
                  native-type="submit"
                  :disabled="!hasDataChanged"
                  :loading="isLoading"
                >
                  Update
                </b-button>
                <b-button
                  type="is-danger is-light"
                  :loading="isLoading"
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
    ...mapActions('rooms', ['roomUpdate', 'getRoomByID', 'roomRemove']),
    ...mapActions('utils', ['toast', 'confirm']),
    // Míos
    /**
     * Actualiza una Sala
     */
    async updateRoom() {
      this.isLoading = true;
      try {
        await this.roomUpdate({
          roomID: this.id,
          name: this.room.name,
          description: this.room.description,
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
          await this.roomRemove(this.id);
          this.$router.push({ name: 'Home' });
          this.toast({ message: 'Room removed', type: 'is-success' });
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
  },

  computed: {
    ...mapGetters('rooms', ['getRoom']),
    /**
     * Comprueba que haya cambios en los dos campos
     */
    hasDataChanged() {
      return this.room.name && this.room.description;
    },
  },
};
</script>

<style>
</style>

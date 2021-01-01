<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title has-text-centered">Create Room</h1>

          <form @submit.prevent="createRoom">
            <b-field label="Name" position="is-left">
              <p class="control has-icons-left has-icons-right">
                <b-input
                  placeholder="e.g. Black Cat mania 😼"
                  required
                  type="text"
                  v-model.trim="roomData.name"
                  key="room-create-name-input"
                ></b-input>
                <span class="icon is-small is-left">
                  <i class="fab fa-forumbee"></i>
                </span>
              </p>
            </b-field>

            <b-field label="Description" position="is-left">
              <p class="control has-icons-left has-icons-right">
                <b-input
                  placeholder="e.g. Let's talk about why Black Cat's are fucking awesome"
                  required
                  type="textarea"
                  maxlength="200"
                  v-model.trim="roomData.description"
                  key="room-create-description-input"
                ></b-input>
                <!-- <span class="icon is-small is-left">
                  <i class="fas fa-info-circle"></i>
                </span> -->
              </p>
            </b-field>

            <div class="field is-grouped has-text-right">
              <div class="buttons">
                <b-button
                  tag="input"
                  type="is-link"
                  native-type="submit"
                  :loading ="isLoading"
                  >Create
                </b-button>
              </div>
            </div>
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
    roomData: {
      name: '',
      description: '',
    },
  }),
  // Metodos
  methods: {
    // De vuex
    ...mapActions('rooms', ['roomsCreate']),
    ...mapActions('utils', ['toast']),
    // Míos

    /**
     * Crea una sala
     */
    async createRoom() {
      this.isLoading = true;
      try {
        await this.roomsCreate({
          name: this.roomData.name,
          description: this.roomData.description,
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
    },

    /**
     * Redirecciona los datos
     */
    redirect() {
      setTimeout(() => this.$router.push({ name: 'Home' }), 1000);
    },
  },
};
</script>

<style>
</style>

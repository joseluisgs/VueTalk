<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <!-- Update form -->
            <h1 class="title has-text-centered">User's Profile</h1>
            <form v-if="user" @submit.prevent="updateProfile">
              <b-field label="Name" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input
                    :placeholder="user.displayName"
                    type="text"
                    v-model.trim="userData.name"
                    key="username-input">
                  </b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-user"></i>
                  </span>
                </p>
              </b-field>
              <b-field label="Email" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input
                    :placeholder="user.email"
                    type="email"
                    v-model.trim="userData.email" key="usermail-input">
                  </b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope-o"></i>
                  </span>
                </p>
              </b-field>
              <b-field label="Password" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input
                    type="password" icon="password" v-model.trim="userData.password" key="userpassword-input"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
                </p>
              </b-field>
              <div class="field is-grouped has-text-right">
                <div class="buttons">
                  <b-button
                    tag="input"
                    type="is-link"
                    native-type="submit"
                    :disabled="!hasDataChanged"
                    :loading="isLoading"
                  >Actualizar
                  </b-button>
                  <!-- <b-button type="is-danger" @click="loginGoogle" outlined>Google</b-button> -->
                </div>
              </div>
            </form>
          <!-- End Profile form -->
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'UserProfileView',
  // Mi modelo de datos
  data: () => ({
    isLoading: false,
    userData: {
      name: '',
      email: '',
      password: '',
    },
  }),
  methods: {
    // Metodos de Vuex
    ...mapActions('user', ['profileUpdate']),
    ...mapActions('utils', ['toast']),

    /**
     * Actualiza el perfil del usuario
     */
    async updateProfile() {
      this.isLoading = true;
      try {
        await this.profileUpdate({
          name: this.userData.name,
          email: this.userData.email,
          password: this.userData.password,
        });
        this.toast({ message: 'Account data updated', type: 'is-success' });
        this.resetData();
      } catch (error) {
        this.toast({ message: error.message, type: 'is-danger' });
        console.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Limpia los datos del modelo
     */
    resetData() {
      this.userData.name = '';
      this.userData.email = '';
      this.userData.password = '';
    },
  },
  computed: {
    // Nos traemos el estado
    ...mapState('user', ['user']),
    /**
     * Ativa el evento input si hay cambios
     */
    hasDataChanged() {
      return (
        // Name exists and is different
        (this.userData.name && (this.userData.name !== this.user.displayName))
        // Email exists and is different
        || (this.userData.email && (this.userData.email !== this.user.email))
        // Password exists
        || this.userData.password.length
      );
    },
  },
};
</script>

<style>

</style>

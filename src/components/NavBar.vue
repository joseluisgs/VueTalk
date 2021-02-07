<template>
  <b-navbar type="is-primary" shadow fixed-top>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
        <img
          class="navbar__logo"
          src="../assets/img/VueTalk-logo.png"
          alt="Vue Talk en Vue"
        />
      </b-navbar-item>
    </template>
    <!-- Navegación -->
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ name: 'Home' }" href="#">
        Home
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ name: 'Create' }" href="#">
        Create Room
      </b-navbar-item>
      <b-navbar-dropdown label="Info">
        <b-navbar-item tag="router-link" :to="{ name: 'About' }" href="#">
          About
        </b-navbar-item>
        <b-navbar-item href="https://twitter.com/joseluisgonsan">
          Contact
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
    <!-- Botones de fin -->
    <template slot="end">
      <b-navbar-item tag="div">
        <b-navbar-item v-if="user" tag="div"> Hi!, {{ user.displayName }} </b-navbar-item>
        <div class="buttons">
          <template v-if="user">
            <b-button
              tag="router-link"
              :to="{ name: 'Profile' }"
              type="is-info"
              icon-left="account"
            >
              <strong>Profile</strong>
            </b-button>
            <b-button type="is-light" @click="doLogout" icon-left="logout">
              Logout
            </b-button>
          </template>
        </div>
      </b-navbar-item>
      <b-switch v-model="darkMode" passive-type="is-warning" type="is-dark">
        <span v-if="darkMode === true">
          <img alt="logo" src="../assets/img/moon.png" width="25" />
        </span>
        <span v-else>
          <img alt="logo" src="../assets/img/sun.png" width="25" />
        </span>
      </b-switch>
    </template>
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'NavBar',

  // Mi modelo
  data: () => ({
    darkMode: true,
  }),

  // Ciclos de vida
  // Lo hacemos en el munted y no en el created porque necesitamos acceder al DOM
  // https://codingpotions.com/vue-ciclo-vida
  async mounted() {
    // Nos lo llevamos a VUEX: Utils
    // check for active theme
    this.darkMode = await this.loadTheme();
  },

  // Mis métodos
  methods: {
    ...mapActions('user', ['userLogout']),
    ...mapActions('utils', ['toast', 'changeTheme', 'loadTheme']),
    /**
     * Realiza el Log out
     */
    doLogout() {
      try {
        this.userLogout();
        this.$router.push({ name: 'Auth' });
        this.toast({ message: 'Logged Out', type: 'is-success' });
      } catch (error) {
        this.toast({ message: error.message, type: 'is-danger' });
        console.error(error.message);
      }
    },
  },
  // Mis variables o campos compuados
  computed: {
    ...mapState('user', ['user']),
  },

  watch: {
    async darkMode() {
      // Nos lo llevamos a VUEX: Utils
      // add/remove class to/from html tag
      if (this.darkMode) {
        await this.changeTheme({ theme: 'dark' });
      } else {
        await this.changeTheme({ theme: 'light' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar-item img {
  max-height: none;
}
.navbar__logo {
  width: 200px;
  height: auto;
}
</style>

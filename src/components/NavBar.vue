<template>
  <b-navbar>
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
        <b-navbar-item v-if="user"> Hi!, {{ user.displayName }} </b-navbar-item>
        <div class="buttons">
          <template v-if="user">
            <b-button
              tag="router-link"
              :to="{ name: 'Profile' }"
              type="is-primary"
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
    </template>
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'NavBar',

  // Mis métodos
  methods: {
    ...mapActions('user', ['userLogout']),
    ...mapActions('utils', ['toast']),

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

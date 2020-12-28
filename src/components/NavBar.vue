<template>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item
              tag="router-link"
              :to="{ path: '/' }">
                <img
                    class="navbar__logo"
                    src="../assets/img/VueTalk-logo.png"
                    alt="Vue Talk en Vue"
                >
            </b-navbar-item>
        </template>
        <!-- Navegación -->
        <template slot="start">
            <b-navbar-item
              tag="router-link"
              :to="{ name: 'Home' }"
              href="#">
                Home
            </b-navbar-item>
            <b-navbar-item
              tag="router-link"
              :to="{ name: 'Home' }"
              href="#">
                Create Room
            </b-navbar-item>
        </template>
        <!-- Botones de fin -->
        <template slot="end">
            <b-navbar-item tag="div">
              <b-navbar-item v-if="user"><i class="fas fa-user-alt"></i>  Hi!, {{user.displayName}}</b-navbar-item>
                <div class="buttons">
                  <template v-if="user">
                    <b-button
                      tag="router-link"
                      :to="{ name: 'Profile' }"
                      type="is-primary">
                      <strong>Profile</strong>
                    </b-button>
                    <b-button
                      type="is-light"
                      @click="doLogout">
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

    /**
     * Realiza el Log out
     */
    doLogout() {
      try {
        this.userLogout();
        this.$router.push({ name: 'Auth' });
        this.$toast.success('Logged Out');
      } catch (error) {
        this.$toast.error(error.message);
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
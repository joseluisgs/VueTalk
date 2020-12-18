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
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Profile</strong>
                    </a>
                    <a
                      @click="doLogout"
                      class="button is-light">
                        Log out
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
export default {
  name: 'NavBar',

  methods: {
    doLogout() {
      console.log('logOut');
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

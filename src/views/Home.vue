<template>
  <section class="section">
    <div class="container">
      <button v-if="!user"
        @click="doLogin"
        class="button">
          Login with Google 🚀
      </button>
      <template v-else>
          <h1 class="title has-text-centered">Hi {{ user.displayName }}</h1>
          <button
            @click="doLogout"
            class="button">
            Logout 🙀
          </button>
        </template>
    </div>
  </section>
</template>

<script>
import Auth from '@/services/Firebase/Auth';

export default {
  name: 'Home',

  // Mi modelo de datos
  data: () => ({
    user: null,
  }),

  // Mi Métodos
  methods: {
    // Loguarse siguiendo la filosofía de Google
    async doLogin() {
      try {
        this.user = await Auth.loginGoogle();
      } catch (error) {
        console.error(error.message);
      }
    },
    // Desloguarse siguiendo la filosofía de Google
    async doLogout() {
      try {
        await Auth.logout();
        this.user = null;
      } catch (error) {
        console.error(error.message);
      }
    },
  },

};
</script>

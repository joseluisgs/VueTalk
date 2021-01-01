<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">
        Rooms
      </h1>
      <!-- Insertamos el componente con la lista -->
      <RoomsComponent :rooms="rooms" v-if="user"/>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import RoomsComponent from '../components/RoomsComponent.vue';

export default {
  name: 'RoomsView',

  // Mis componentes que uso
  components: {
    RoomsComponent,
  },

  // // Mi Métodos
  // methods: {
  //   /**
  //    * Inicia el proceso de identificación
  //    */
  //   async doLogin() {
  //     try {
  //       this.user = await Auth.loginGoogle();
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   },

  //   /**
  //    * Inicia el proceso de desloguearse
  //    */
  //   async doLogout() {
  //     try {
  //       await Auth.logout();
  //       this.user = null;
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   },
  // },

  // Metodos computados
  computed: {
    ...mapState('rooms', ['rooms']),
    ...mapState('user', ['user']),
  },
};
</script>

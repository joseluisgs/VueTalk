<template>
  <div id="app">
    <NavBar />
    <!-- Añadimos una transicion
     https://vuejs.org/v2/guide/transitions.html -->
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <Footer />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
  },
};
</script>

<style lang="scss">

// Programamos las transiciones
// https://vuejs.org/v2/guide/transitions.html
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>

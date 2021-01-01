<template>
  <!-- <div v-if="!$store.state.isLoading"> -->
  <div v-if="!isLoading">
    <h1 v-if="!rooms.length" class="subtitle has-text-centered mt-2">
      No rooms avaibale.
      <router-link :to="{ name: 'create' }">Create one</router-link>.
    </h1>
    <div v-else class="columns is-multiline">
      <!-- Room element -->
      <div v-for="room in rooms" :key="room.id" class="column is-one-third">
        <!-- Le envolvemos el enlnace -->
        <router-link :to="{ name: 'View', params: { id: room.id } }">
          <div class="card">
            <div class="card-image">
              <figure class="image is-16by9">
                <img
                  src="https://bulma.io/images/placeholders/1280x960.png"
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ room.name }}</p>
                  <p class="subtitle is-6">by {{ room.adminName }}</p>
                </div>
              </div>
              <div class="content">
                {{ room.description }}
              </div>
              <nav class="buttons is-right">
                <b-button
                  tag="router-link"
                  :to="{ name: 'Update', params: { id: room.id } }"
                  size="is-small"
                  v-if="room.adminUid === getUserUid"
                >
                  Edit
                </b-button>
              </nav>
            </div>
          </div>
        </router-link>
      </div>
      <!-- End of room element -->
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'RoomsComponent',
  // Propiedades con las que nos inicializamos
  props: {
    rooms: {
      type: Array,
      required: true,
    },
  },

  // Métdos computados para acceder a usuario
  computed: {
    // Nos traemos el estado
    ...mapState(['isLoading']),
    ...mapGetters('user', ['getUserUid']), // cuidado que es un vector
  },
};
</script>

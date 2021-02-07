<template>
  <div>
    <article class="section">
      <div class="container">
        <div class="columns">
          <!-- Solo si tenemos mensajes los listamos, los traemos de estado de vuex mensajes -->
          <div v-if="room" class="column is-half is-offset-one-quarter">
            <h1 class="title has-text-centered">{{ room.name }}</h1>
            <div class="messages content" ref="messages">
              <!-- Si el mensaje es nuestro lo ponemos de otro color -->
              <div
                v-for="message in roomMesseges"
                :key="message.id"
                class="message"
                :class="{
                  'message--own': message.userId === getUserUid,
                }"
              >
                <p class="message__text">
                  {{ message.message }}
                  <span>
                    <br />
                    <small class="message__time">
                      <i v-if="message.userId !== getUserUid">{{ message.userName }}</i>
                      <i v-else>Me</i>
                      <i>: {{ message.createdAt | timeAgo }} ago</i>
                    </small>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
    <section class="send">
      <!-- Formulario para enviar mensaje -->
      <form @submit.prevent="createMessage" class="form">
        <b-input
          placeholder="Write your message here..."
          required
          type="textarea"
          v-model.trim="message"
          key="message-create-input"
        ></b-input>
        <div class="buttons">
          <b-button
            :disabled="!message"
            type="is-info"
            native-type="submit"
            :loading="isLoading"
            icon-left="send"
            >Send
          </b-button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import {
  mapState, mapGetters, mapActions, mapMutations,
} from 'vuex';

// Librería de tiempo y su plugin de tiempo relativo
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export default {
  name: 'RoomView',

  // Modelo de datos
  data: () => ({
    isLoading: false,
    message: '',
    room: null,
    userUid: '',
  }),

  // Mis propiedades
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  // Ciclo del vida
  /**
   * Al crearme compruebo que existo en varios lugares,
   * ya sea en mi estado Vuex, o en firebase
   */
  async created() {
    this.userUid = this.getUserUid;
    // console.log(this.userUid);
    try {
      // Grab from local state
      this.room = await this.getRoomByID(this.id);
      // Una vez tenemos la sala nos traemos los mensajes del id que tenemos como prop
      // Ya no lo hacemos así porque debemos esucharlos siempre para
      // crear notificaciones
      // this.getMessages(this.id);
      // console.log(`Al cargar: --> ${this.room.name}`);
      // Actualizamos los Metadatos, inicando que entramos, se añaden
      await this.updateMeta({
        roomID: this.id,
        exit: false,
        uid: this.userUid,
      });
    } catch (error) {
      console.error(error.message);
      this.toast({ message: error.message, type: 'is-danger' });
      // Empujamos al home si no existe en ningún lado
      this.$router.push({ name: 'Home' });
    }
  },

  /**
   * Si me destruyo dejamos de escuchar mensajes, pues mensajes hay muchos más que
   * salas, por eso esto no lo hacemos por salas, para no recibir cintínuamente todos los mensajes de las salas a las que puedo estar
   * suscrito
   */
  destroyed() {
    // Eliminamos la lógica de no esuchar mensajes.
    // this.setMessagesListener(null);

    // actualizamos los metadatos del usuario indcando que estamos saliendo, se eliminan
    if (this.room != null) {
      // console.log(`Al salir: --> ${this.room.name}`);
      this.updateMeta({
        roomID: this.id,
        exit: true,
        uid: this.userUid,
      });
    }
  },

  methods: {
    // De vuex
    ...mapMutations('messages', ['setMessagesListener']),
    ...mapActions('messages', ['messageCreate']),
    ...mapActions('rooms', ['getRoomByID']),
    ...mapActions('utils', ['toast']),
    ...mapActions('user', ['updateMeta']),

    // Mis métodos
    async createMessage() {
      this.isLoading = true;
      try {
        await this.messageCreate({
          roomID: this.id,
          message: this.message,
        });
        this.scrollDown();
        this.clearData();
      } catch (error) {
        console.error(error.message);
        this.toast({ message: error.message, type: 'is-danger' });
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Trabajamos el scrolldow hasta el límite inferior de la sala
     * $refs nos sirve para operar con el DOM, por eso atacamos de refs la etiqueta messages
     * ref="messages" en nuestro código HTML/Template
     */
    scrollDown() {
      const { messages } = this.$refs;
      // usamos nextick para traer una copia lista del DOM
      // que vamos a renderizar para carcular el alto que tenemos y hacer el scroll
      this.$nextTick(() => {
        const height = messages.scrollHeight;
        window.scrollTo({
          top: height,
          behavior: 'smooth',
        });
      });
    },

    /**
     * Limpia los datos
     */
    clearData() {
      this.message = '';
    },
  },

  // Mis filtros
  filters: {
    /**
     * Re devuelve cuánto hace respecto a una fecha dada
     */
    timeAgo(timestamp) {
      const date = new Date(timestamp);
      return dayjs().from(dayjs(date), true);
    },
  },

  // Métdos computados para acceder a usuario
  computed: {
    // Nos traemos el estado
    ...mapGetters('user', ['getUserUid']),
    ...mapGetters('rooms', ['getRoom']),
    ...mapState('messages', ['messages']),
    // Las computed no pueden ser arrow functions
    roomMesseges() {
      return this.messages.filter((message) => message.roomId === this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.section {
  padding-bottom: 1rem;
}
.messages {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-bottom: 14rem;
}
.message {
  padding: 1rem;
  width: 75%;
  &--own {
    background-color: #baffc5;
    width: 75%;
    align-self: flex-end;
  }
  &__time {
    color: gray;
    font-size: 12px;
  }
  &__text {
    color: rgb(61, 61, 61)
  }
}
.send {
  background-color: lightgray;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 12rem;
  margin-bottom: 1rem;
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16rem;
  & > *:first-child {
    flex-grow: 1;
    margin-right: 1rem;
  }
}
.textarea.form__textarea {
  min-height: 2rem;
}

</style>

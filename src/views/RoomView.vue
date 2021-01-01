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
                v-for="message in messages"
                :key="message.id"
                class="message"
                :class="{
                  'message--own': message.userId === getUserUid,
                }"
              >
                <p>
                  {{ message.message }}
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
            tag="input"
            type="is-info"
            native-type="submit"
            :loading="isLoading"
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

export default {
  name: 'RoomView',

  // Modelo de datos
  data: () => ({
    isLoading: false,
    message: '',
    room: null,
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
    try {
      // Grab from local state
      let room = await this.getRoom(this.id);
      // console.log(`Room: ${room.name}`);
      if (!room) {
        // Grab from Cloud Firestore 🔥
        room = await this.getRoomByID(this.id);
        if (!room) throw new Error('Could not find room');
      }
      this.room = room;
      // Una vez tenemos la sala nos traemos los mensajes del id que tenemos como prop
      this.getMessages(this.id);
    } catch (error) {
      console.error(error.message);
      this.$toast.error(error.message);
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
    this.setMessagesListener(null);
  },

  methods: {
    // De vuex
    ...mapMutations('messages', ['setMessagesListener']),
    ...mapActions('messages', ['getMessages', 'messageCreate']),
    ...mapActions('rooms', ['getRoomByID']),

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
        this.$toast.error(error.message);
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

  // Métdos computados para acceder a usuario
  computed: {
    // Nos traemos el estado
    ...mapGetters('user', ['getUserUid']),
    ...mapGetters('rooms', ['getRoom']),
    ...mapState('messages', ['messages']),
  },
};
</script>

<style lang="scss" scoped>
.messages {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-bottom: 90px;
}
.message {
  padding: 1rem;
  width: 75%;
  &--own {
    background-color: #baffc5;
    width: 75%;
    align-self: flex-end;
  }
}
.send {
  background-color: gray;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > *:first-child {
    flex-grow: 1;
    margin-right: 1rem;
  }
}
.textarea.form__textarea {
  min-height: 4rem;
}
</style>

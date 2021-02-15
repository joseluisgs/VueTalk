<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button
          class="delete"
          aria-label="close"
          @click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body has-text-centered">
         <h3 class="subtitle has-text-centered is-size-4">
          {{ message }}
        </h3>
        <!-- Si pulsamos grabar -->
        <b-button v-if="!recorder" @click="record()" class="is-info">
          Start recording
        </b-button>
        <!-- Si paramos la grabación -->
        <b-button v-else @click="stop()" class="is-danger">
          Stop recording
        </b-button>
        <!-- Mostramos la previsualización del audio -->
        <div class="mt-5" v-if="audio">
          <h5 class="subtitle is-marginless mb-1">Review your recording</h5>
          <audio :src="newAudioURL" controls></audio>
        </div>
      </section>
      <footer class="modal-card-foot buttons is-right">
        <!-- Evento de cnfirmación, devolvemos el fichero audio en el veneto confirm -->
        <b-button
          :disabled="!audio"
          @click="confirm()"
          :class="actionClass"
        >
          Confirm
        </b-button>
        <b-button @click="$emit('close')" class="button">Cancel</b-button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RecordModalComponent',
  // Mis propiedades que me vienen del padre
  props: {
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    actionClass: {
      type: String,
      default: 'is-success',
    },
  },

  // Mi modelo de datos
  data: () => ({
    audio: null,
    recorder: null,
  }),

  // Mis métodos
  methods: {
    // De Vuex
    ...mapActions('utils', ['toast']),

    /**
     * Emitimos el evento confirm, devolviendo el audio y cerramos el modal
     */
    confirm() {
      this.$emit('confirm', this.audio);
      this.$parent.close();
    },

    /**
     * Inicia la grabación creando un stream de audio
     */
    async record() {
      try {
        this.audio = null;
        // Abrimos el sistema de grabación del dispositivo/navegador para solo audio.
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        // Indicamos ell formato y el stream donde se grabará.
        const options = { mimeType: 'audio/webm' };
        const recordedChunks = [];
        // Se inicia la grabacion y se añadiendo fragmentos al stream una vez detectados
        this.recorder = new MediaRecorder(stream, options);
        this.recorder.addEventListener('dataavailable', (e) => {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });
        // si se para, creamos el Blob o binario de la grabación.
        this.recorder.addEventListener('stop', () => {
          this.audio = new Blob(recordedChunks);
        });
        // Si no comenzamos a grabar
        this.recorder.start();
      } catch (error) {
        this.toast({ message: error.message, type: 'is-danger' });
      }
    },

    /**
     * Paramos la grabación
     */
    stop() {
      this.recorder.stop();
      this.recorder = null;
    },
  },

  // Mis propiedades computadas
  computed: {
    /**
     * Obtiene la URL del fichero generado
     */
    newAudioURL() {
      return URL.createObjectURL(this.audio);
    },
  },
};
</script>

<style lang="scss" scoped>
// Nos aseguramos de que quede centrada
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

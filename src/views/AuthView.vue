<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <!-- Loging form -->
          <template v-if="action === 'login'">
            <h1 class="title has-text-centered">Login</h1>
            <form @submit.prevent="doLogin">
              <b-field label="Email" position="is-left">
                <b-input
                  placeholder="your@mail.com"
                  required
                  type="email"
                  icon="email"
                  v-model.trim="userData.email"
                  key="login-user-mail-input"
                  minlength="5"
                ></b-input>
              </b-field>
              <b-field label="Password" position="is-left">
                <b-input
                  placeholder="password"
                  required
                  type="password"
                  icon="lock"
                  v-model.trim="userData.password"
                  key="login-user-password-input"
                   minlength="5"
                ></b-input>
              </b-field>
              <div class="field is-grouped has-text-right">
                <div class="buttons">
                  <b-button
                    type="is-link"
                    native-type="submit"
                    :loading="isLoading"
                    icon-left="login"
                    >Login
                  </b-button>
                  <!-- <b-button type="is-danger" @click="loginGoogle" outlined>Google</b-button> -->
                </div>
              </div>
              <a class="is-block" href="#" @click="action = 'register'"
                >Don't have an account?</a
              >
              <a class="is-block" href="#" @click="action = 'reset'"
                >Forgot your password?</a
              >
            </form>
          </template>
          <!-- End Loging form -->

          <!-- Register form -->
          <template v-if="action === 'register'">
            <h1 class="title has-text-centered">Register</h1>
            <form @submit.prevent="doRegister">
              <b-field label="Name" position="is-left">
                <b-input
                  placeholder="Your Name"
                  required
                  type="text"
                  icon="account"
                  v-model.trim="userData.name"
                  key="register-user-name-input"
                  minlength="5"
                ></b-input>
              </b-field>
              <b-field label="Email" position="is-left">
                <b-input
                  placeholder="your@mail.com"
                  required
                  type="email"
                  icon="email"
                  v-model.trim="userData.email"
                  key="register-user-mail-input"
                  minlength="5"
                ></b-input>
              </b-field>
              <b-field label="Password" position="is-left">
                <b-input
                  placeholder="password"
                  required
                  type="password"
                  icon="lock"
                  v-model.trim="userData.password"
                  key="register-user-password-input"
                  minlength="5"
                ></b-input>
              </b-field>
              <div class="field is-grouped has-text-righ">
                <div class="buttons">
                  <b-button
                    type="is-link"
                    native-type="submit"
                    icon-left="account-plus"
                    :disabled="!hasDataChanged"
                    :loading="isLoading"
                    >Register
                  </b-button>
                  <!-- <b-button type="is-danger" @click="loginGoogle" outlined>Google</b-button> -->
                </div>
              </div>
              <a href="#" @click="action = 'login'">Want to login?</a>
            </form>
          </template>
          <!-- End Loging form -->

          <!-- Password reset email -->
          <template v-if="action === 'reset'">
            <h1 class="title has-text-centered">Reset</h1>
            <form @submit.prevent="doReset">
              <b-field label="Email" position="is-left">
                <b-input
                  placeholder="your@mail.com"
                  required
                  type="email"
                  icon="email"
                  v-model.trim="userData.email"
                  key="reset-user-mail-input"
                  minlength="5"
                ></b-input>
              </b-field>
              <div class="field is-grouped has-text-righ">
                <div class="buttons">
                  <b-button
                    type="is-link"
                    native-type="submit"
                    :loading="isLoading"
                    icon-left="lock-reset"
                    >Reset
                  </b-button>
                </div>
              </div>
              <a href="#" @click="action = 'register'"
                >Don't have an account?</a
              >
            </form>
          </template>
          <!-- End of Password reset email -->
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AuthView',
  // Mi modelo de datos
  data: () => ({
    action: 'login',
    isLoading: false,
    userData: {
      name: '',
      email: '',
      password: '',
    },
  }),
  methods: {
    // Sobre el estado usaremos
    ...mapActions('user', ['userLogin', 'userRegister', 'resetPassword']),
    ...mapActions('utils', ['toast']),

    /**
     * Realiza el login
     */
    async doLogin() {
      this.isLoading = true;
      try {
        await this.userLogin({
          email: this.userData.email,
          password: this.userData.password,
        });
        this.toast({ message: 'Logged In', type: 'is-success' });
        this.resetData();
        this.redirect();
      } catch (error) {
        this.toast({ message: error.message, type: 'is-danger' });
        console.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Realiza el Registro
     */
    async doRegister() {
      this.isLoading = true;
      try {
        await this.userRegister({
          name: this.userData.name,
          email: this.userData.email,
          password: this.userData.password,
        });
        this.toast({ message: 'Account Created', type: 'is-success' });
        this.resetData();
        this.redirect();
      } catch (error) {
        this.toast({ message: error.message, type: 'is-danger' });
        console.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Realiza el resteo de password
     */
    async doReset() {
      this.isLoading = true;
      try {
        console.log(this.userData.email);
        await this.resetPassword(this.userData.email);
        this.toast({ message: `Please check ${this.userData.email} for further instructions`, type: 'is-success' });
        this.resetData();
      } catch (error) {
        this.toast({ message: error.message, type: 'is-danger' });
        console.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Redirecciona a una página
     */
    redirect() {
      this.$router.push({ name: 'Home' });
    },

    /**
     * Resetea los datos
     */
    resetData() {
      this.userData.name = '';
      this.userData.email = '';
      this.userData.password = '';
    },
  },
  computed: {
    hasDataChanged() {
      return this.userData.name.length >= 5 && this.userData.email.length >= 5 && this.userData.password.length >= 5;
    },
  },
};
</script>

<style>
</style>
